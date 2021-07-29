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
  menuSelect,
  searchBox,
  EXPERIMENTAL_dynamicWidgets,
  panel,
} from 'instantsearch.js/es/widgets';
import {
  connectQueryRules,
  connectCurrentRefinements,
  connectSearchBox,
  connectConfigure,
  connectHits,
} from 'instantsearch.js/es/connectors';

import aa from 'search-insights';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';

export function searchResults() {
  // ADD FILTERS FOR SPECIFIC URLS
  let extraSearchFilters = '';

  let locationPathname = window.location.pathname.toLowerCase();

  // for accessories
  if (locationPathname.includes('categorypageaccessories')) {
    extraSearchFilters = 'keywords:"accessories"';
  }
  // for jeans
  else if (locationPathname.includes('categorypagejeans')) {
    extraSearchFilters = 'keywords:"jeans"';
  }

  // Initialize instantsearch
  const searchClient = algoliasearch(
    'HYDY1KWTWB',
    '28cf6d38411215e2eef188e635216508'
  );

  const search = instantsearch({
    indexName: 'gstar_demo_test',
    searchClient,
    routing: true,
  });

  // Initialize insights for instantsearch
  const insightsMiddleware = createInsightsMiddleware({
    insightsClient: aa,
  });

  search.use(insightsMiddleware);

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
      return JSON.parse(decodeURIComponent(atob(serializedPayload)));
    } catch (error) {
      throw new Error(
        'The insights middleware was unable to parse `data-insights-event`.'
      );
    }
  };

  // Initialize query suggestions index
  let suggestionIndex = algoliasearch(
    'HYDY1KWTWB',
    '28cf6d38411215e2eef188e635216508'
  ).initIndex('gstar_demo_test_query_suggestions');

  // Declared globally for data persistence
  let catlist = [];
  let catlistIsrefined = [];

  const renderCustomSearchBar = (renderOptions, isFirstRender) => {
    const { query } = renderOptions;
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
        // Initialize category
        if (hits && hits[0].category && catlist.length === 0)
        catlist = hits[0].category;
        
        // If on jeans category, ignore suggestion "jeans"
        if (
          extraSearchFilters.includes('jeans') &&
          catlist[0].toLowerCase() === 'jeans'
        ) {
          // Pop it out
          catlist.shift();
        }

        if (catlist && catlist.length > 0 && catlistIsrefined.length === 0) {
          // Format data to add isRefined
          catlist.map((cat) => {
            if (cat.toLowerCase() === query.toLowerCase()) {
              return;
            }

            catlistIsrefined.push({
              name: cat,
              isRefined: false,
            });
          });
        }

        suggestionContainer.querySelector('ul').innerHTML = catlistIsrefined
          .filter((_, idx) => idx < 5)
          .map(
            (category, idx) => ` 
                        <li class="" id="${idx}" style="${isRefined(
              category
            )}">${category.name}</li>
                    `
          )
          .join('');

        [...suggestionContainer.querySelectorAll('li')].forEach((element) => {
          element.addEventListener('click', (event) => {
            event.preventDefault();

            // Update isRefined value
            if (catlistIsrefined[event.target.id])
              catlistIsrefined[event.target.id].isRefined = !catlistIsrefined[
                event.target.id
              ].isRefined;

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

  function displayPrice(hit) {
    if (hit.newPrice) {
      return `<p class="cross-price">$${hit.price}</p>
                    <p class="price">$${hit.newPrice}</p>`;
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

  const renderConfigure = (renderOptions, isFirstRender) => {
    const { refine } = renderOptions;

    const userToken = document.querySelector('.user-token-selector');
    userToken.addEventListener('change', (e) => {
      refine({
        userToken: e.target.value,
        ruleContexts: [e.target.value],
        filters: extraSearchFilters,
        enablePersonalization: e.target.value !== '' ? true : false,
      });
    });
  };

  const customConfigure = connectConfigure(renderConfigure);

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
                                    <img 
                                    src="https://flagship-fashion-demo-images.s3.amazonaws.com/images/${
                                      hit.objectID
                                    }.jpg"
                                    align="left" alt="${
                                      hit.name
                                    }" class="result-img" data-id="${
                hit.objectID
              }"  />
                                    <div class="result-img-overlay"></div>
                                    <div class="hit-addToCart">
                                        <a ${bindEvent(
                                          'click',
                                          hit,
                                          'Product Clicked'
                                        )}><i class="fas fa-ellipsis-h"></i></a>
                                    </div>
                                    <div class="hit-sizeFilter">
                                        <p>Sizes available: <span>${
                                          hit.sizeFilter
                                            ? hit.sizeFilter.join(', ')
                                            : ''
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
    customQueryRuleCustomData({
      container: document.querySelector('#banner'),
    }),
    customCurrentRefinements({
      container: document.querySelector('#current-refinements'),
    }),
    customConfigure({
      container: document.querySelector('#configure'),
      searchParameters: {
        hitsPerPage: 20,
        enablePersonalization: false,
        filters: extraSearchFilters,
        query: localStorage.getItem('userQuery')
          ? localStorage.getItem('userQuery')
          : ``,
      },
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
    clearRefinements({
      container: '#clear-refinements',
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
    stats({
      container: '#stats-searchResult',
    }),
    searchBox({
      container: '#autocomplete',
    }),
    connectedHitsWithInjectedContent({ container: '#hits' }),
    pagination({
      container: '#pagination',
    }),
    EXPERIMENTAL_dynamicWidgets({
      container: '#dynamic-widgets',
      widgets: [
        (container) =>
          panel({
            templates: {
              header: 'Fit',
            },
          })(refinementList)({
            container,
            attribute: 'non_numeric_attributes.fitFilter',
          }),
        (container) =>
          panel({
            templates: {
              header: 'Length',
            },
          })(refinementList)({
            container,
            attribute: 'non_numeric_attributes.lengthFilter',
          }),
        (container) =>
          panel({
            templates: {
              header: 'Stretch',
            },
          })(refinementList)({
            container,
            attribute: 'non_numeric_attributes.stretchFilter',
          }),
        (container) =>
          panel({
            templates: {
              header: 'Gender',
            },
          })(refinementList)({
            container,
            attribute: 'genderFilter',
          }),
        (container) =>
          panel({
            templates: {
              header: 'Category',
            },
          })(refinementList)({
            container,
            attribute: 'category',
          }),
        (container) =>
          panel({
            templates: {
              header: 'Price',
            },
          })(rangeSlider)({
            container,
            attribute: 'price',
            tooltips: true,
            pips: true,
          }),
        (container) =>
          panel({
            templates: {
              header: 'Color',
            },
          })(refinementList)({
            container,
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
        (container) =>
          panel({
            templates: {
              header: 'Sizes',
            },
          })(menuSelect)({
            container,
            attribute: 'sizeFilter',
          }),
      ],
    }),
  ]);

  search.start();
}
