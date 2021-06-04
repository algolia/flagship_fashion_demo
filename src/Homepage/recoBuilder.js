function getFiltersFromRecommendations({
  fallbackFilters,
  recommendations,
  threshold,
}) {
  if (recommendations.length === 0) {
    return fallbackFilters;
  }

  const recommendationFilters = recommendations
    .filter((recommendation) => recommendation.score > threshold)
    .map(({ objectID, score }) => `objectID:${objectID}<score=${score * 100}>`);

  return [...recommendationFilters, ...fallbackFilters];
}

function getSearchParametersForRelatedProducts({
  fallbackFilters,
  recommendations,
  threshold,
}) {
  return {
    optionalFilters: getFiltersFromRecommendations({
      fallbackFilters,
      recommendations,
      threshold,
    }),
  };
}

function getSearchParametersForFrequentlyBoughtTogether({
  fallbackFilters,
  recommendations,
  threshold,
}) {
  if (fallbackFilters.length === 0) {
    return {
      // We want strict recommendations for FBT when there's no fallback because
      // we cannot guess what products were bought with the reference product.
      facetFilters: [
        recommendations
          .filter((recommendation) => recommendation.score > threshold)
          .map((recommendation) => `objectID:${recommendation.objectID}`),
      ],
    };
  }

  return {
    optionalFilters: getFiltersFromRecommendations({
      fallbackFilters,
      recommendations,
      threshold,
    }),
  };
}

export function getSearchParametersForModel(params) {
  return (model) => {
    switch (model) {
      case 'bought-together':
        return getSearchParametersForFrequentlyBoughtTogether(params);
      case 'related-products':
        return getSearchParametersForRelatedProducts(params);
      default:
        throw new Error(`Unknown model: ${JSON.stringify(model)}.`);
    }
  };
}

function sortBy(predicate, items) {
  const itemsCopy = [...items];
  itemsCopy.sort(predicate);

  return itemsCopy;
}

function uniqBy(key, items) {
  return [...new Map(items.map((item) => [item[key], item])).values()];
}

export function getHitsPerPage({
  fallbackFilters,
  maxRecommendations,
  recommendationsCount,
}) {
  const hasFallback = fallbackFilters.length > 0;

  if (recommendationsCount === 0) {
    return hasFallback ? maxRecommendations : 0;
  }

  // There's recommendations and a fallback, we force to retrieve
  // `maxRecommendations` number of hits.
  if (hasFallback) {
    return maxRecommendations;
  }

  // Otherwise, cap the hits retrieved with `maxRecommendations`
  return maxRecommendations > 0
    ? Math.min(recommendationsCount, maxRecommendations)
    : recommendationsCount;
}

export function recoBuilder(props) {
  // props includes:
  // searchClient, indexName, fallbackFilters
  // maxRecommendations, objectIDs, threshold
  // model, transformItems

  return props.searchClient
    .initIndex(props.indexName)
    .getObjects(props.objectIDs)
    .then((response) => {
      //   console.log(response);
      const recommendationsList = response.results.map(
        (result) => result?.recommendations ?? []
      );

      return props.searchClient
        .search(
          recommendationsList.map((recommendations) => {
            // This computes the `hitsPerPage` value as if a single `objectID`
            // was passed.
            const globalHitsPerPage = getHitsPerPage({
              fallbackFilters: props.fallbackFilters,
              maxRecommendations: props.maxRecommendations,
              recommendationsCount: recommendations.length,
            });
            // This reduces the `globalHitsPerPage` value to get a `hitsPerPage`
            // that is divided among all requests.
            const hitsPerPage =
              globalHitsPerPage > 0
                ? Math.ceil(globalHitsPerPage / props.objectIDs.length)
                : globalHitsPerPage;
            const searchParametersForModel = getSearchParametersForModel({
              fallbackFilters: props.fallbackFilters,
              recommendations,
              threshold: props.threshold,
            })(props.model);

            return {
              indexName: props.indexName,
              params: {
                hitsPerPage,
                ...searchParametersForModel,
                ...props.searchParameters,
                facetFilters: (
                  searchParametersForModel.facetFilters || []
                ).concat(props.searchParameters.facetFilters || []),
                optionalFilters: (
                  searchParametersForModel.optionalFilters || []
                ).concat(props.searchParameters.optionalFilters || []),
              },
            };
          })
        )
        .then((response) => {
          //   console.log(response);
          const hits =
            // Since recommendations from multiple indices are returned, we
            // need to sort them descending based on their score.
            sortBy(
              (a, b) => {
                const scoreA = a.__recommendScore || 0;
                const scoreB = b.__recommendScore || 0;

                return scoreA < scoreB ? 1 : -1;
              },
              // Multiple identical recommended `objectID`s can be returned b
              // the engine, so we need to remove duplicates.
              uniqBy(
                'objectID',
                response.results.flatMap((result) =>
                  result.hits.map((hit, index) => {
                    const match = recommendationsList
                      .flat()
                      .find((x) => x.objectID === hit.objectID);

                    return {
                      ...hit,
                      __indexName: props.indexName,
                      __queryID: result.queryID,
                      __position: index + 1,
                      __recommendScore: match?.score ?? null,
                    };
                  })
                )
              )
            ).slice(
              0,
              // We cap the number of recommendations because the previously
              // computed `hitsPerPage` was an approximation due to `Math.ceil`.
              props.maxRecommendations > 0
                ? props.maxRecommendations
                : undefined
            );

          //   console.log(props.transformItems(hits));
          return props.transformItems(hits);
        });
    });
}
