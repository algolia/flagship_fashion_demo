
import instantsearch from "instantsearch.js";
import algoliasearch from "algoliasearch";
import { index } from "instantsearch.js/es/widgets";
import { connectAutocomplete } from 'instantsearch.js/es/connectors';
import {
    autocomplete,
    getAlgoliaResults,
    highlightHit,
} from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import '@algolia/autocomplete-theme-classic';
import { html } from 'htm/preact';


export function autocompleteHome() {


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
                            return [
                            ];
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
                                        highlightPreTag: `<mark>`,
                                        highlightPostTag: `</mark>`,
                                        maxFacetHits: 5,
                                        enablePersonalization: true,
                                    },
                                },
                                {

                                    indexName: 'gstar_demo_test',
                                    params: {
                                        facetName: 'category',
                                        facetQuery: query,
                                        highlightPreTag: `<mark>`,
                                        highlightPostTag: `</mark>`,
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
                                            // const highlightedValue = highlightHit({
                                            //     item,
                                            //     attribute: 'query',
                                            // });
                                            return productTemplate({
                                                image: item.image_link,
                                                title: highlightHit({ hit: item, attribute: 'name' }),
                                                description: item.description,
                                                price: item.price,
                                                query: products.query,
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
                                                query: products.query
                                            });
                                        },
                                    },
                                },
                                {
                                    sourceId: 'categories',
                                    getItems() {
                                        return categories.facetHits;
                                    },
                                    templates: {
                                        header() {
                                            return headerTemplate({ title: 'Categories' });
                                        },
                                        item({ item }) {
                                            return facetTemplate({
                                                title: item.value,
                                                query: products.query,
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
            return html`

            <div class="aa-titleCategory">
                <h3>${title}</h3>
            </div>

            `;
        }

        function productTemplate({ image, title, description, price, query }) {
            return html`
            <div class="aa-ItemContent">
                <a href="./searchResults.html?gstar_demo_test%5Bquery%5D=${query}" class="aa-ItemLink">
                    <div class="aa-ItemImage">
                        <img src="${image}" alt="${title}"/>
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
                <a href="./searchResults.html?gstar_demo_test%5Bquery%5D=${query}" class="aa-btnShowMore">
                    ${title}
                </a>
          </div>
        `;
        }

        function facetTemplate({ title, query }) {
            return html`
            <div class="aa-ItemContentCategory">
            <a href="./searchResults.html?gstar_demo_test%5Bquery%5D=${query}" class="aa-ItemLinkCategory">
                <div class="aa-ItemTitle">${title}</div>
            </a>
          </div>
        `;
        }
    }

    search.start();
}