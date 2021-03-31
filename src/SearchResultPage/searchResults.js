import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import {
  clearRefinements,
  refinementList,
  stats,
  sortBy,
  pagination,
  rangeSlider,
  voiceSearch,
  configure,
  index,
} from 'instantsearch.js/es/widgets';
import {
  connectRefinementList,
  connectQueryRules,
  connectCurrentRefinements,
  connectAutocomplete,
  connectSearchBox,
  connectConfigure,
  connectHits,
} from 'instantsearch.js/es/connectors';

import {
  autocomplete,
  getAlgoliaResults,
  highlightHit,
} from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import '@algolia/autocomplete-theme-classic';
import { carousel } from '../Homepage/displayCarousel';

import aa from 'search-insights';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';
import { html } from 'htm/preact';

export function searchResults() {
  const searchClient = algoliasearch(
    'HYDY1KWTWB',
    '28cf6d38411215e2eef188e635216508'
  );

  const search = instantsearch({
    indexName: 'gstar_demo_test',
    searchClient,
    routing: true,
  });

  const insightsMiddleware = createInsightsMiddleware({
    insightsClient: aa,
  });

  search.use(insightsMiddleware);

  let suggestionIndex = algoliasearch(
    'HYDY1KWTWB',
    '28cf6d38411215e2eef188e635216508'
  ).initIndex('gstar_demo_test_query_suggestions');

  const findInsightsTarget = (startElement, endElement, validator) => {
    let element = startElement;
    while (element && !validator(element)) {
      if (element === endElement) {
        return null;
      }
      element = element.parentElement;
    }
    return element;
  };

  const parseInsightsEvent = (element) => {
    const serializedPayload = element.getAttribute('data-insights-event');

    if (typeof serializedPayload !== 'string') {
      throw new Error(
        'The insights middleware expects `data-insights-event` to be a base64-encoded JSON string.'
      );
    }

    try {
      return JSON.parse(atob(serializedPayload));
    } catch (error) {
      throw new Error(
        'The insights middleware was unable to parse `data-insights-event`.'
      );
    }
  };

  const renderCustomSearchBar = (renderOptions, isFirstRender) => {
    const { items, refine, widgetParams, query } = renderOptions;
    const suggestionContainer = document.querySelector(
      '.refinement-list-SearchResult'
    );
    if (isFirstRender) {
      const ul = document.createElement('ul');
      ul.classList.add('suggestion-wrapper');
      suggestionContainer.appendChild(ul);
    }

    suggestionIndex
      .search(query, {
        hitsPerPage: 1,
      })
      .then(({ hits }) => {
        suggestionContainer.querySelector('ul').innerHTML = hits
          .map((item) =>
            item.category
              .map(
                (i) => ` 
                        <li style="${isRefined(i)}">${i}</li>
                    `
              )
              .slice(0, 11)
              .join('')
          )
          .join('');

        [...suggestionContainer.querySelectorAll('li')].forEach((element) => {
          element.addEventListener('click', (event) => {
            event.preventDefault();
            search.renderState[
              'gstar_demo_test'
            ].refinementList.category.refine(event.target.innerText);
            // refine(event.target.innerText);
          });
        });
      });
  };

  function isRefined(item) {
    if (item.isRefined) {
      return 'color: white !important; background-color: rgba(0,0,0, 0.9)';
    }
  }

  const renderQueryRuleCustomData = (renderOptions, isFirstRender) => {
    const { items, widgetParams, refine } = renderOptions;

    const checkBanner = items.map((item) => {
      if (items.length < 2) {
        return item.banner;
      }
    });

    if (!checkBanner.includes(undefined)) {
      let banner = widgetParams.container;
      banner.style.display = 'block';
      widgetParams.container.innerHTML = `
            <div class="banner-wrapper">
              ${items
                .map(
                  (item) =>
                    `<a href="${item.link}">
                            <div class="banner-overlay"></div>
                            <div class="banner-title--wrapper">
                                <h3>${item.title}</h3>
                                <div class="underline-bannerTitle"></div>
                            </div>
                            <img src="${item.banner}">
                        </a>`
                )
                .join('')}
            </div>
          `;
    } else {
      let banner = widgetParams.container;
      banner.style.display = 'none';
    }
  };

  const createDataAttribtues = (refinement) =>
    Object.keys(refinement)
      .map((key) => `data-${key}="${refinement[key]}"`)
      .join(' ');

  const renderListItem = (item) => `
      ${item.refinements
        .map(
          (refinement) => `
                <li>${
                  refinement.attribute === 'hexColorCode'
                    ? refinement.value.split('//')[0]
                    : refinement.value
                } (${refinement.count != undefined ? refinement.count : '$'})
            <button ${createDataAttribtues(
              refinement
            )} class="btnCloseRefinements">X</button></li>`
        )
        .join('')}
`;

  const renderCurrentRefinements = (renderOptions, isFirstRender) => {
    const { items, widgetParams, refine } = renderOptions;
    document.querySelector('#current-refinements').innerHTML = `
            <ul class="currentRefinment-filters">
              ${items.map(renderListItem).join('')}
            </ul>
          `;

    [
      ...widgetParams.container.querySelectorAll('.btnCloseRefinements'),
    ].forEach((element) => {
      element.addEventListener('click', (event) => {
        const item = Object.keys(event.currentTarget.dataset).reduce(
          (acc, key) => ({
            ...acc,
            [key]: event.currentTarget.dataset[key],
          }),
          {}
        );

        refine(item);
      });
    });
  };

  const customSearchBox = connectSearchBox(renderCustomSearchBar);
  const customQueryRuleCustomData = connectQueryRules(
    renderQueryRuleCustomData
  );
  const customCurrentRefinements = connectCurrentRefinements(
    renderCurrentRefinements
  );

  function createAutocompleteSearchBox() {
    const appId = 'HYDY1KWTWB';
    const apiKey = '28cf6d38411215e2eef188e635216508';
    const searchClient = algoliasearch(appId, apiKey);

    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'search',
      limit: 3,
    });
    const querySuggestionsPlugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'gstar_demo_test_query_suggestions',
      getSearchParams() {
        return recentSearchesPlugin.data.getAlgoliaSearchParams({
          hitsPerPage: 3,
        });
      },
    });
    // Use autocompleteRef to track the current autocomplete instance
    const autocompleteRef = { current: null };
    // Use indicesRef to track which index (or indices) to query using autocomplete
    const indicesRef = { current: [] };

    const renderAutocomplete = (renderOptions, isFirstRender) => {
      const { indices, refine } = renderOptions;

      // Store indices prop in indicesRef
      indicesRef.current = indices || [];
      // Instantiate autocomplete instance during the first render
      if (isFirstRender) {
        autocompleteRef.current = autocomplete({
          container: '#autocomplete',
          // debug: true,
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
                  indexName: 'gstar_demo_test',
                  params: {
                    hitsPerPage: 3,
                    attributesToSnippet: ['name:10'],
                    enablePersonalization: true,
                  },
                },
              ],
            }).then(async ([products]) => {
              const [categories] = await searchClient.searchForFacetValues([
                {
                  indexName: 'gstar_demo_test',
                  params: {
                    facetName: 'name',
                    facetQuery: query,
                    highlightPreTag: '<mark>',
                    highlightPostTag: '</mark>',
                    maxFacetHits: 5,
                    enablePersonalization: true,
                  },
                },
                {
                  indexName: 'gstar_demo_test',
                  params: {
                    facetName: 'category',
                    facetQuery: query,
                    highlightPreTag: '<mark>',
                    highlightPostTag: '</mark>',
                    maxFacetHits: 5,
                    enablePersonalization: true,
                  },
                },
              ]);

              return [
                {
                  sourceId: 'products',
                  getItems() {
                    return products.hits;
                  },
                  templates: {
                    header() {
                      return headerTemplate({ title: 'Products' });
                    },
                    item({ item }) {
                      return productTemplate({
                        image: item.image_link,
                        title: highlightHit({ hit: item, attribute: 'name' }),
                        description: item.description,
                        price: item.price,
                        _highlightResult: {
                          query: {
                            title: {
                              value:
                                '__aa-highlight__He__/aa-highlight__llo t__aa-highlight__he__/aa-highlight__re',
                            },
                          },
                        },
                      });
                    },
                    footer() {
                      return moreResultsTemplate({
                        title: `See all products (${products.nbHits})`,
                      });
                    },
                  },
                },
                {
                  sourceId: 'category',
                  getItems() {
                    return categories.facetHits;
                  },
                  templates: {
                    header() {
                      return headerTemplate({ title: 'Categories' });
                    },
                    item({ item }) {
                      return facetTemplate({ title: item.value });
                    },
                  },
                },
              ];
            });
          },
          onSubmit({ root, sections, state, event }) {
            const stateCollection = state.collections[2].items.length;
            // console.log(state);
            if (stateCollection === 0) {
              noResult(stateCollection);
            } else {
              refine(state.query);
              displayResultOrNoResult(stateCollection);
            }
          },
        });
        // During subsequent renders, refresh the autocomplete instance
      } else if (autocompleteRef.current) {
        autocompleteRef.current.refresh();
      }
    };

    return connectAutocomplete(renderAutocomplete);

    function headerTemplate({ title }) {
      return html`
        <div class="aa-titleCategory">
          <h3>${title}</h3>
        </div>
      `;
    }

    function productTemplate({ image, title, description, price, query }) {
      return html`
        <div class="aa-ItemContent">
          <a
            href="./searchResults.html?gstar_demo_test%5Bquery%5D=${query}"
            class="aa-ItemLink"
          >
            <div class="aa-ItemImage">
              <img src="${image}" alt="${title}" />
            </div>
            <div class="aa-ItemInfos">
              <div class="aa-ItemTitle">${title}</div>
              <div class="aa-ItemPrice">$${price}</div>
            </div>
          </a>
        </div>
      `;
    }

    function moreResultsTemplate({ title, query }) {
      return html`
        <div class="aa-btnShowMore-wrapper">
          <a
            href="./searchResults.html?gstar_demo_test%5Bquery%5D=${query}"
            class="aa-btnShowMore"
          >
            ${title}
          </a>
        </div>
      `;
    }

    function facetTemplate({ title, query }) {
      return html`
        <div class="aa-ItemContentCategory">
          <a
            href="./searchResults.html?gstar_demo_test%5Bquery%5D=${query}"
            class="aa-ItemLinkCategory"
          >
            <div class="aa-ItemTitle">${title}</div>
          </a>
        </div>
      `;
    }

    function noResult(stateCollection) {
      let executed = false;
      if (!executed) {
        executed = true;
        displayResultOrNoResult(stateCollection);
        const containerNoresult = document.querySelector('.container');
        const noResults = document.querySelector('.noResultMessage');
        const query = document.querySelector('.aa-InputWrapper input').value;
        const pagination = document.querySelector('#pagination');
        pagination.style.display = 'none';

        if (!noResults) {
          let noResults = document.createElement('div');
          noResults.innerHTML = '';
          noResults.classList.add('noResultMessage');
          noResults.innerHTML = `<p>Sorry no result for <span>${query}</span></p>
                <p>Please check the spelling or try to remove filters</p>
                <p>You can check our latest trends and collection bellow</p>`;
          containerNoresult.prepend(noResults);
        } else {
          noResults.innerHTML = '';
          noResults.classList.add('noResultMessage');
          noResults.innerHTML = `<p>Sorry no result for <span>${query}</span></p>
                <p>Please check the spelling or try to remove filters</p>
                <p>You can check our latest trends and collection bellow</p>`;
          containerNoresult.prepend(noResults);
        }

        const searchClient = algoliasearch(
          'HYDY1KWTWB',
          '28cf6d38411215e2eef188e635216508'
        );

        const search = instantsearch({
          indexName: 'gstar_demo_test',
          searchClient,
        });

        function getUserToken() {
          const getPersona = localStorage.getItem('personaValue');

          return getPersona;
        }

        //GET THE CONFIG
        function getCarouselConfigs() {
          return searchClient
            .initIndex('gstar_demo_config')
            .search('', {
              facetFilters: ['userToken:' + getUserToken()],
              attributesToHighlight: [],
              attributesToRetrieve: ['title', 'indexName', 'configure'],
            })
            .then((res) => res.hits);
        }

        //WIDGET CREATION
        let carouselWidgets = [];
        function createWidgets(carousels) {
          const container = document.querySelector('#stacked-carousels');

          container.innerText = '';

          return carousels.map((carouselConfig) => {
            const carouselContainer = document.createElement('div');
            carouselContainer.className = 'carousel';

            const indexWidget = index({
              indexName: carouselConfig.indexName,
              indexId: carouselConfig.objectID,
            });

            if (carouselConfig.configure) {
              indexWidget.addWidgets([
                configure({
                  ...carouselConfig.configure,
                  userToken: getUserToken(),
                }),
              ]);
            }

            indexWidget.addWidgets([
              carousel({
                title: carouselConfig.title,
                container: carouselContainer,
              }),
            ]);

            container.appendChild(carouselContainer);
            return indexWidget;
          });
        }

        // retrieve the carousel configuration once
        getCarouselConfigs().then((carousels) => {
          carouselWidgets = createWidgets(carousels);
          search.addWidgets(carouselWidgets);
          search.start();
        });
      }
    }

    function displayResultOrNoResult(stateCollection) {
      const hitContainer = document.querySelector('#hitsResults');
      const hit = document.querySelector('#hits');
      const noResultCarousel = document.querySelector('#stacked-carousels');
      const noResultContainer = document.querySelector('.container');
      const pagination = document.querySelector('#pagination');

      if (stateCollection === 0) {
        hit.classList.add('displayFalse');
        hit.classList.remove('displayGrid');
        hitContainer.classList.remove('displayGrid');
        hitContainer.classList.add('displayFalse');
        noResultCarousel.classList.add('displayTrue');
        noResultCarousel.classList.remove('displayFalse');
        noResultContainer.classList.remove('displayFalse');
        noResultContainer.classList.add('displayTrue');
      } else {
        hitContainer.classList.add('displayGrid');
        hitContainer.classList.remove('displayFalse');
        hit.classList.add('displayGrid');
        hit.classList.remove('displayFalse');
        noResultCarousel.classList.remove('displayGrid');
        noResultCarousel.classList.add('displayFalse');
        noResultContainer.classList.add('displayFalse');
        noResultContainer.classList.remove('displayTrue');
        pagination.style.display = 'block';
      }
    }
  }

  function displayPrice(hit) {
    if (hit.newPrice) {
      return `<p class="cross-price">$${hit.price}</p>
                    <p>$${hit.newPrice}</p>`;
    } else {
      return `<p>$${hit.price}</p>`;
    }
  }

  function displayEcoBadge(hit) {
    if (hit.badges) {
      let eco = hit.badges.eco;
      if (eco) {
        return `<div class="badge badgeEco"><p>Eco</p></div>`;
      } else {
        return ``;
      }
    } else {
      return ``;
    }
  }

  function displayOffBadge(hit) {
    if (hit.badges) {
      let off = hit.badges.off;
      if (off) {
        let discount = (1 - hit.newPrice / hit.price) * 100;
        discount = Math.floor(parseInt(discount, 10));
        return `<div class="badge badgeOff">${discount}% Off</div>`;
      } else {
        return ``;
      }
    } else {
      return ``;
    }
  }

  function noResult(hits, query) {
    let executed = false;
    if (!executed) {
      executed = true;

      displayResultOrNoResult(hits);
      const containerNoresult = document.querySelector('.container');
      const noResults = document.querySelector('.noResultMessage');
      const pagination = document.querySelector('#pagination');
      pagination.style.display = 'none';

      if (!noResults) {
        let noResults = document.createElement('div');
        noResults.innerHTML = '';
        noResults.classList.add('noResultMessage');
        noResults.innerHTML = `<p>Sorry no result for <span>${query}</span></p>
            <p>Please check the spelling or try to remove filters</p>
            <p>You can check our latest trends and collection bellow</p>`;
        containerNoresult.prepend(noResults);
      } else {
        noResults.innerHTML = '';
        noResults.classList.add('noResultMessage');
        noResults.innerHTML = `<p>Sorry no result for <span>${query}</span></p>
            <p>Please check the spelling or try to remove filters</p>
            <p>You can check our latest trends and collection bellow</p>`;
        containerNoresult.prepend(noResults);
      }

      const searchClient = algoliasearch(
        'HYDY1KWTWB',
        '28cf6d38411215e2eef188e635216508'
      );

      const search = instantsearch({
        indexName: 'gstar_demo_test',
        searchClient,
      });

      const userTokenSelector = document.getElementById('user-token-selector');
      userTokenSelector.addEventListener('change', () => {
        userTokenSelector.disabled = true;
        search.removeWidgets(carouselWidgets);
        getCarouselConfigs().then((carousels) => {
          userTokenSelector.disabled = false;
          carouselWidgets = createWidgets(carousels);
          search.addWidgets(carouselWidgets);
        });
      });

      function getUserToken() {
        return userTokenSelector.value;
      }
      //GET THE CONFIG
      function getCarouselConfigs() {
        return searchClient
          .initIndex('gstar_demo_config')
          .search('', {
            facetFilters: ['userToken:' + getUserToken()],
            attributesToHighlight: [],
            attributesToRetrieve: ['title', 'indexName', 'configure'],
          })
          .then((res) => res.hits);
      }

      //WIDGET CREATION
      let carouselWidgets = [];
      function createWidgets(carousels) {
        const container = document.querySelector('#stacked-carousels');

        container.innerText = '';

        return carousels.map((carouselConfig) => {
          const carouselContainer = document.createElement('div');
          carouselContainer.className = 'carousel';

          const indexWidget = index({
            indexName: carouselConfig.indexName,
            indexId: carouselConfig.objectID,
          });

          if (carouselConfig.configure) {
            indexWidget.addWidgets([
              configure({
                ...carouselConfig.configure,
                userToken: getUserToken(),
              }),
            ]);
          }

          indexWidget.addWidgets([
            carousel({
              title: carouselConfig.title,
              container: carouselContainer,
            }),
          ]);

          container.appendChild(carouselContainer);
          return indexWidget;
        });
      }

      // retrieve the carousel configuration once
      getCarouselConfigs().then((carousels) => {
        userTokenSelector.disabled = false;
        carouselWidgets = createWidgets(carousels);
        search.addWidgets(carouselWidgets);
        search.start();
      });
    }
  }

  function displayResultOrNoResult(hits) {
    const hitContainer = document.querySelector('#hitsResults');
    const hit = document.querySelector('#hits');
    const noResultCarousel = document.querySelector('#stacked-carousels');
    const noResultContainer = document.querySelector('.container');
    const pagination = document.querySelector('#pagination');

    if (hits === 0) {
      hit.classList.add('displayFalse');
      hit.classList.remove('displayGrid');
      hitContainer.classList.remove('displayGrid');
      hitContainer.classList.add('displayFalse');
      noResultCarousel.classList.add('displayTrue');
      noResultCarousel.classList.remove('displayFalse');
      noResultContainer.classList.remove('displayFalse');
      noResultContainer.classList.add('displayTrue');
    } else {
      hitContainer.classList.add('displayGrid');
      hitContainer.classList.remove('displayFalse');
      hit.classList.add('displayGrid');
      hit.classList.remove('displayFalse');
      noResultCarousel.classList.remove('displayGrid');
      noResultCarousel.classList.add('displayFalse');
      noResultContainer.classList.add('displayFalse');
      noResultContainer.classList.remove('displayTrue');
      pagination.style.display = 'block';
    }
  }

  const renderConfigure = (renderOptions, isFirstRender) => {
    const { refine, widgetParams } = renderOptions;

    const userToken = document.querySelector('.user-token-selector');
    userToken.addEventListener('change', (e) => {
      refine({ userToken: e.target.value });
    });
  };

  const customConfigure = connectConfigure(renderConfigure);

  const autocompleteSearchBox = createAutocompleteSearchBox();

  const renderVirtualSearchBox = (renderOptions, isFirstRender) => {
    const { refine } = renderOptions;
    refine(search.renderState.gstar_demo_test.autocomplete.currentRefinement);
  };

  const virtualSearchBox = connectSearchBox(renderVirtualSearchBox);

  const renderHits = (renderOptions, isFirstRender) => {
    const {
      hits,
      widgetParams,
      bindEvent,
      instantSearchInstance,
    } = renderOptions;

    const container = document.querySelector(widgetParams.container);

    if (isFirstRender) {
      container.addEventListener('click', (event) => {
        const targetWithEvent = findInsightsTarget(
          event.target,
          event.currentTarget,
          (element) => element.hasAttribute('data-insights-event')
        );

        if (targetWithEvent) {
          const payload = parseInsightsEvent(targetWithEvent);
          instantSearchInstance.sendEventToInsights(payload);
          popUpEventClick(
            payload.payload.eventName,
            payload.payload.objectIDs[0]
          );
          // popUpEventCart(payload.payload.eventName, payload.payload.objectIDs[0])
        }
      });
    }

    function popUpEventClick(event, object) {
      const index = searchClient.initIndex('gstar_demo_test');
      let rightPanel = document.querySelector('.right-panel');
      let popUpWrapper = document.querySelector('.popUp-wrapper');
      index.getObject(object).then((object) => {
        let div = document.createElement('div');

        if (event === 'Product Clicked') {
          div.classList.add('popUpEventClick');
          div.innerHTML = `Open product details, on ${object.name}`;
        } else if (event === 'Product Added') {
          div.classList.add('popUpEventCart');
          div.innerHTML = `Add to cart product, on ${object.name}`;
        }
        popUpWrapper.appendChild(div);
        div.addEventListener('animationend', () => {
          div.remove();
        });
      });
    }

    const response = renderOptions.results;

    const isValidUserData = (userData) => userData && Array.isArray(userData);

    const shouldInjectRecord = (position, start, end) =>
      position > start && position <= end;

    if (search.renderState.gstar_demo_test.queryRules.items !== undefined) {
      const userData = search.renderState.gstar_demo_test.queryRules.items;

      if (isValidUserData(userData)) {
        if (response !== undefined) {
          //Appending custom data at the beginning of the array of results only if it's in the range of the position
          let start = response.page * response.hitsPerPage + 1;
          let end = response.page * response.hitsPerPage + response.hitsPerPage;
          userData.forEach((record) => {
            if (shouldInjectRecord(record.position, start, end)) {
              response.hits.splice(record.position - 1, 0, record);
            }
          });
        }
      }
    }

    document.querySelector('#hits').innerHTML = `
        ${hits
          .map((hit) => {
            if (hit.injected) {
              return ` <li class="carousel-list-item">
                          <div class="image-wrapper">
                              <img class="injectImg" src="${hit.image}" alt="">
                          </div>
                          <div class="btn-injection-content-wrapper">
                              <a class="btn-injection-content">Check it out</a>
                          </div>
  
                    </li>`;
            } else {
              return `<li
                        
             class="carousel-list-item carousel-list-item-modal-call" data-id="${
               hit.objectID
             }">
                            <div class="badgeWrapper">
                                    <div>${displayEcoBadge(hit)}</div>
                                    <div>${displayOffBadge(hit)}</div>
                                </div>
                            
                                <div class="image-wrapper" data-id="${
                                  hit.objectID
                                }" ${bindEvent(
                'click',
                hit,
                'Product Clicked'
              )}>
                                    <img src="${
                                      hit.image_link
                                    }" align="left" alt="${
                hit.name
              }" class="result-img" data-id="${hit.objectID}"  />
                                    <div class="result-img-overlay"></div>
                                    <div class="hit-addToCart">
                                        <a ${bindEvent(
                                          'click',
                                          hit,
                                          'Product Added'
                                        )}><i class="fas fa-cart-arrow-down"></i></a>
                                    </div>
                                    <div class="hit-sizeFilter">
                                        <p>Sizes available: <span>${
                                          hit.sizeFilter
                                        }</span></p>
                                    </div>
                                </div>
                               
                                <div class="hit-name">
                                    <div class="hit-infos">
                                        <div>${hit.name}</div>
            
                                        <div class="colorWrapper">
                                                <div>${
                                                  hit.hexColorCode
                                                    ? hit.hexColorCode.split(
                                                        '//'
                                                      )[0]
                                                    : ''
                                                }</div>
                                                <div style="background: ${
                                                  hit.hexColorCode
                                                    ? hit.hexColorCode.split(
                                                        '//'
                                                      )[1]
                                                    : ''
                                                }" class="hit-colorsHex"></div>
                                            </div>
            
                                        </div>
                                        <div class="hit-price">
                                        ${displayPrice(hit)}
                                    </div>
            
                                </div>
                           
                        </li>`;
            }
          })
          .join('')}
    `;
  };

  const connectedHitsWithInjectedContent = connectHits(renderHits);

  search.addWidgets([
    customConfigure({
      container: document.querySelector('#configure'),
      searchParameters: {
        hitsPerPage: 20,
        enablePersonalization: true,
      },
    }),
    customQueryRuleCustomData({
      container: document.querySelector('#banner'),
    }),
    customCurrentRefinements({
      container: document.querySelector('#current-refinements'),
    }),

    index({
      indexName: 'gstar_demo_test',
    }).addWidgets([
      configure({
        hitsPerPage: 5,
      }),
      autocompleteSearchBox({
        container: '#autocomplete',
        placeholder: 'Search products',
      }),
      customSearchBox({
        container: document.querySelector('#refinement-list-SearchResult'),
        attribute: 'keywords',
        showMoreLimit: 10,
      }),
      {
        init(opts) {},
      },
      {
        render(options) {
          const results = options.results;
          if (results.nbHits === 0) {
            noResult(results.nbHits, results.query);
          }
        },
      },
    ]),
    configure({
      query: localStorage.getItem('userQuery')
        ? localStorage.getItem('userQuery')
        : ``,
    }),
    {
      init() {
        const container = document.querySelector('#smart-sort-banner');
        container.innerHTML = `
                <div class="ais-SmartSortBanner">
                  <p class="ais-SmartSortBanner-description"></p>
                  <p class="ais-SmartSortBanner-button"></p>
                </div>
              `;
      },

      render(options) {
        const container = document.querySelector('#smart-sort-banner');

        const isSmartSortResult =
          options.results._rawResults.length > 0 &&
          typeof options.results._rawResults[0].nbSortedHits === 'number';
        container.classList.toggle(
          'ais-SmartSortBanner--hidden',
          !isSmartSortResult
        );

        if (!isSmartSortResult) {
          return;
        }

        const { relevancyStrictness } = options.state;
        const showingRelevantResults =
          typeof relevancyStrictness === 'undefined' ||
          relevancyStrictness === 100;

        const button = container.querySelector('.ais-SmartSortBanner-button');
        button.onclick = () => {
          options.helper
            .setQueryParameter(
              'relevancyStrictness',
              showingRelevantResults ? 0 : 100
            )
            .search();
        };
        button.textContent = showingRelevantResults
          ? 'Show all results'
          : 'Show more relevant results';

        container.querySelector(
          '.ais-SmartSortBanner-description'
        ).textContent = showingRelevantResults
          ? 'We removed some search results to show you the most relevants ones.'
          : 'Currently showing all results.';
      },
    },
    virtualSearchBox({ container: '#virtualSearch' }),
    clearRefinements({
      container: '#clear-refinements',
    }),
    refinementList({
      container: '#category-list',
      attribute: 'category',
    }),
    refinementList({
      container: '#gender-list',
      attribute: 'genderFilter',
    }),
    rangeSlider({
      container: '#price-list',
      attribute: 'price',
      tooltips: true,
      pips: true,
    }),
    refinementList({
      container: '#hexColor-list',
      attribute: 'hexColorCode',
      transformItems(items) {
        return items.map((item) => ({
          ...item,
          color: item.value.split('//')[1],
          colorCode: item.value.split('//')[0],
        }));
      },
      templates: {
        item: `
                  <input type="color" value={{color}} class="colorInput" id="{{colorCode}}" {{#isRefined}}checked{{/isRefined}}/>
                  <label for="{{colorCode}}" class="{{#isRefined}}isRefined{{/isRefined}}">
                    {{colorCode}}
                    <span class="color" style="background-color: {{color}}"></span>
                  </label>`,
      },
    }),
    refinementList({
      container: '#size-list',
      attribute: 'sizeFilter',
    }),
    voiceSearch({
      container: '#voicesearch',
      searchAsYouSpeak: true,
      language: 'en-US',
    }),
    sortBy({
      container: '#sort-by',
      items: [
        {
          value: 'gstar_demo_test',
          label: 'Most relevant',
        },
        {
          value: `gstar_demo_test_asc_price`,
          label: 'Sort by ascending price',
        },
        {
          value: `gstar_demo_test_asc_price_smart_sort`,
          label: 'smart sort - Lowest price',
        },
        {
          value: `gstar_demo_test_desc_price`,
          label: 'Sort by descending price',
        },
      ],
    }),
    rangeSlider({
      container: '#price-list',
      attribute: 'price',
      tooltips: true,
      pips: true,
    }),
    stats({
      container: '#stats-searchResult',
    }),
    connectedHitsWithInjectedContent({ container: '#hits' }),
    pagination({
      container: '#pagination',
    }),
  ]);

  search.start();
}
