import {
    autocomplete,
    getAlgoliaResults,
    snippetHit
} from "@algolia/autocomplete-js";
import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";
import algoliasearch from "algoliasearch";
import searchResults from "./searchResults";
import "@algolia/autocomplete-theme-classic";

export function autocompleteSearchResult() {

    const appId = "HYDY1KWTWB";
    const apiKey = "28cf6d38411215e2eef188e635216508";
    const searchClient = algoliasearch(appId, apiKey);

    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
        key: "search",
        limit: 3
    });
    const querySuggestionsPlugin = createQuerySuggestionsPlugin({
        searchClient,
        indexName: "gstar_demo_test_query_suggestions",
        getSearchParams() {
            console.log(arguments);
            return recentSearchesPlugin.data.getAlgoliaSearchParams({
                hitsPerPage: 3
            });
        }
    });

    autocomplete({
        container: "#autocomplete",
        debug: true,
        openOnFocus: true,
        plugins: [recentSearchesPlugin, querySuggestionsPlugin],
        getSources({ query }) {
            if (!query) {
                return [];
            }

            return getAlgoliaResults({
                searchClient,
                queries: [
                    {
                        query,
                        indexName: "gstar_demo_test",
                        params: {
                            hitsPerPage: 3,
                            attributesToSnippet: ["name:10"]
                        }
                    }
                ]
            }).then(async ([products]) => {
                const [categories] = await searchClient.searchForFacetValues([
                    {
                        indexName: "gstar_demo_test",
                        params: {
                            facetName: "name",
                            facetQuery: query,
                            highlightPreTag: "<mark>",
                            highlightPostTag: "</mark>",
                            maxFacetHits: 5
                        }
                    },
                    {
                        indexName: "gstar_demo_test",
                        params: {
                            facetName: "category",
                            facetQuery: query,
                            highlightPreTag: "<mark>",
                            highlightPostTag: "</mark>",
                            maxFacetHits: 5
                        }
                    }
                ]);

                return [
                    {
                        getItems() {
                            return products.hits;
                        },
                        templates: {
                            header() {
                                return headerTemplate({ title: "Products" });
                            },
                            item({ item }) {
                                return productTemplate({
                                    image: item.image_link,
                                    title: snippetHit({ hit: item, attribute: "name" }),
                                    description: item.description,
                                    price: item.price
                                });
                            },
                            footer() {
                                return moreResultsTemplate({
                                    title: `See all products (${products.nbHits})`
                                });
                            }
                        }
                    },
                    // {
                    //     getItems() {
                    //         return brands.facetHits;
                    //     },
                    //     templates: {
                    //         header() {
                    //             return headerTemplate({ title: "Brands" });
                    //         },
                    //         item({ item }) {
                    //             return facetTemplate({ title: item.highlighted });
                    //         }
                    //     }
                    // },
                    {
                        getItems() {
                            return categories.facetHits;
                        },
                        templates: {
                            header() {
                                return headerTemplate({ title: "Categories" });
                            },
                            item({ item }) {
                                return facetTemplate({ title: item.highlighted });
                            }
                        }
                    }
                ];
            });
        },
        render({ root, sections, state }) {
            const index = searchClient.initIndex('gstar_demo_test');
            const hitContainer = document.querySelector('#hits');
            // const ul = document.createElement('ul')
            // ul.classList.add('ais-Hits-list')
            // hitContainer.appendChild(ul)
            // console.log(ul)
            index.search(state.query).then((result) => {
                const hits = result.hits
                hitContainer.innerHTML = hits.map(hit =>
                    `
                    <li class="ais-Hits-item">
                    <a href="${hit.url}" class="product-searchResult" data-id="${hit.objectID}">
                        <div class="image-wrapper">
                            <img src="${hit.image_link}" align="left" alt="${hit.name}" class="result-img" />
                            <div class="hit-sizeFilter">
                                <p>Sizes available: <span>${hit.sizeFilter}</span></p>
                            </div>
                        </div>
                        <div class="hit-name">
                            <div class="hit-infos">
                                <div>${hit.name}</div>
                                    
                                <div class="colorWrapper">
                                        <div>${hit.ColorCode}</div>
                                        <div style="background: ${hit.color}" class="hit-colorsHex"></div>
                                    </div>
                                    
                                    
                                </div>
                            <div class="hit-price">$${hit.price}</div>
                            
                        </div>
                    </a>
                </li>
                    `
                ).join('')
            })
            getQueryFromUser(state.query)
            root.append(...sections);
        }
    });

    function headerTemplate({ title }) {

        return `
        <div class="aa-titleCategory">
            <h3>${title}</h3>
        </div>
        ` ;
    }

    function productTemplate({ image, title, description, price }) {
        return `
      <div class="aa-ItemContent">
        <div class="aa-ItemImage">
          <img src="${image}" alt="${title}">
        </div>
        <div class="aa-ItemInfos">
        <div class="aa-ItemTitle">${title}</div>
        <div class="aa-ItemPrice">$${price}</div>
        </div>
      </div>
    `;
    }

    function moreResultsTemplate({ title }) {
        return `
        <div class="aa-btnShowMore-wrapper">
            <a href="#" class="aa-btnShowMore">
                ${title}
            </a>
      </div>
    `;
    }

    function facetTemplate({ title }) {
        return `
      <div class="aa-ItemContent">
        <div class="aa-ItemTitle">${title}</div>
      </div>
    `;
    }

    function getQueryFromUser(query) {
        return query
    }
}
