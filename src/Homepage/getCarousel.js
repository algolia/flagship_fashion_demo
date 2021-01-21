import { carousel } from "./displayCarousel";
import instantsearch from "instantsearch.js";
import algoliasearch from "algoliasearch";
import { configure, index, searchBox, pagination, refinementList, stats } from "instantsearch.js/es/widgets";
import { connectAutocomplete } from 'instantsearch.js/es/connectors';
import {
    autocomplete,
    getAlgoliaResults,
    snippetHit,
} from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import '@algolia/autocomplete-theme-classic';


export function GetDataForCarousel() {
    // GET CREDENTIALS
    const searchClient = algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508');

    const search = instantsearch({
        indexName: 'gstar_demo_test',
        searchClient,
        routing: true
    });

    const autocompleteSearchBox = createAutocompleteSearchBox();

    search.addWidgets([
        index({
            indexName: 'gstar_demo_test',
        }).addWidgets([
            autocompleteSearchBox({
                container: '#autocomplete',
                placeholder: 'Search products',
            })
        ])
    ])

    const userTokenSelector = document.getElementById("user-token-selector");
    userTokenSelector.addEventListener("change", () => {
        userTokenSelector.disabled = true;
        search.removeWidgets(carouselWidgets);
        getCarouselConfigs().then((carousels) => {
            userTokenSelector.disabled = false;
            carouselWidgets = createWidgets(carousels);
            search.addWidgets(carouselWidgets);
        });
    });

    function getUserToken() {
        localStorage.setItem('personaValue', userTokenSelector.value)
        return userTokenSelector.value;
    }


    //GET THE CONFIG
    function getCarouselConfigs() {
        return searchClient
            .initIndex("gstar_demo_config")
            .search("", {
                facetFilters: ['userToken:' + getUserToken()],
                attributesToHighlight: [],
                attributesToRetrieve: ["title", "indexName", "configure"],
            })
            .then((res) => res.hits);
    }

    //WIDGET CREATION
    let carouselWidgets = [];
    function createWidgets(carousels) {
        const container = document.querySelector("#stacked-carousels");

        container.innerText = "";

        return carousels.map((carouselConfig) => {

            const carouselContainer = document.createElement("div");
            carouselContainer.className = "carousel";

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
                stats({
                    container: '#stats',
                })
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
                                                title: snippetHit({ hit: item, attribute: 'name' }),
                                                description: item.description,
                                                price: item.price,
                                                query: products.query,
                                            });
                                        },
                                        footer() {
                                            return moreResultsTemplate({
                                                title: `See all products (${products.nbHits})`,
                                                query: products.query
                                            });
                                        },
                                    },
                                },
                                {
                                    getItems() {
                                        return categories.facetHits;
                                    },
                                    templates: {
                                        header() {
                                            return headerTemplate({ title: 'Categories' });
                                        },
                                        item({ item }) {
                                            return facetTemplate({
                                                title: item.highlighted,
                                                query: products.query
                                            });
                                        },
                                    },
                                },
                            ];
                        });
                    },
                    onSubmit({ root, sections, state }) {
                        refine(state.query);
                        window.location.href = `./searchResults.html?gstar_demo_test%5Bquery%5D=${state.query}`

                    },
                });
                // During subsequent renders, refresh the autocomplete instance
            } else if (autocompleteRef.current) {
                autocompleteRef.current.refresh();
            }
        };

        return connectAutocomplete(renderAutocomplete);

        function headerTemplate({ title }) {
            return `
            <div class="aa-titleCategory">
                <h3>${title}</h3>
            </div>
            `;
        }

        function productTemplate({ image, title, description, price, query }) {
            return `
            <div class="aa-ItemContent">
                <a href="./searchResults.html?gstar_demo_test%5Bquery%5D=${query}" class="aa-ItemLink">
                    <div class="aa-ItemImage">
                        <img src="${image}" alt="${title}">
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
            return `
            <div class="aa-btnShowMore-wrapper">
                <a href="./searchResults.html?gstar_demo_test%5Bquery%5D=${query}" class="aa-btnShowMore">
                    ${title}
                </a>
          </div>
        `;
        }

        function facetTemplate({ title, query }) {
            return `
          <div class="aa-ItemContentCategory">
            <a href="./searchResults.html?gstar_demo_test%5Bquery%5D=${query}" class="aa-ItemLinkCategory">
                <div class="aa-ItemTitle">${title}</div>
            </a>
          </div>
        `;
        }
    }
}
