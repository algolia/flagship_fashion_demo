/** @jsx h */

import {
    autocomplete,
    AutocompleteComponents,
    getAlgoliaResults,
} from '@algolia/autocomplete-js';
import {
    AutocompleteInsightsApi,
    createAlgoliaInsightsPlugin,
} from '@algolia/autocomplete-plugin-algolia-insights';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

import algoliasearch from 'algoliasearch';
import insightsClient from 'search-insights';
import { h, Fragment, render } from 'preact';


import '@algolia/autocomplete-theme-classic';

import { ProductHit } from './types';

export function autocompleteHomePage() {


    const appId = 'HYDY1KWTWB';
    const apiKey = '28cf6d38411215e2eef188e635216508';
    const searchClient = algoliasearch(appId, apiKey);

    // @ts-expect-error type error in search-insights
    insightsClient('init', { appId, apiKey });

    const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

    const querySuggestionsPlugin = createQuerySuggestionsPlugin({
        searchClient,
        indexName: 'gstar_demo_test_query_suggestions',
        getSearchParams() {
            return {
                hitsPerPage: 8,
            };
        },
    });

    // const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
    //     key: 'RECENT_SEARCH',
    //     limit: 5,
    // });

    autocomplete<ProductHit>({
        container: '#autocomplete',
        placeholder: 'Search',
        debug: true,
        openOnFocus: true,
        plugins: [algoliaInsightsPlugin, querySuggestionsPlugin,],
        render({ sections, Fragment }, root) {
            // const recentSearches = sections.find(({ props }) => {
            //     return (
            //         props['data-autocomplete-source-id'] === 'recentSearchesPlugin'
            //     );
            // });
            const querySuggestions = sections.find(({ props }) => {
                return (
                    props['data-autocomplete-source-id'] === 'querySuggestionsPlugin'
                );
            });
            const product = sections.find(({ props }) => {
                return props['data-autocomplete-source-id'] === 'products';
            });
            const categories = sections.find(({ props }) => {
                return props['data-autocomplete-source-id'] === 'category';
            });

            render(
                <div className="aa-PanelLayout aa-Panel--scrollable">
                    {/* {recentSearches ? (
                        <div className="recentSearches">{recentSearches}</div>
                    ) : null} */}
                    <div className="querySuggestions"><span class="aa-SourceHeaderTitle">Suggestions</span>{querySuggestions}</div>
                    <div className="product">{product}</div>
                    <div className="categories">{categories}</div>
                </div>,
                root
            );
        },
        getSources({ query, state }) {
            if (!query) {
                return [];
            }



            return [
                {
                    sourceId: 'products',
                    getItems() {
                        return getAlgoliaResults<ProductHit>({
                            searchClient,
                            queries: [
                                {
                                    indexName: 'gstar_demo_test',
                                    query,
                                    params: {
                                        clickAnalytics: true,
                                        attributesToSnippet: ['name:10'],
                                        snippetEllipsisText: '…',
                                        hitsPerPage: 9,
                                    },
                                },
                            ],
                        });
                    },
                    templates: {
                        header() {
                            return (
                                <Fragment>
                                    <span className="aa-SourceHeaderTitle">Products</span>
                                    <div className="aa-SourceHeaderLine" />
                                </Fragment>
                            );
                        },
                        item({ item, components }) {
                            return (
                                <ProductItem
                                    hit={item}
                                    components={components}
                                    insights={state.context.algoliaInsightsPlugin.insights}
                                />
                            );
                        },
                        noResults() {
                            return 'No products for this query.';
                        },
                    },
                },
                {
                    sourceId: 'category',
                    getItems() {
                        return getAlgoliaResults({
                            searchClient,
                            queries: [
                                {
                                    indexName: 'gstar_demo_test',
                                    query,
                                    params: {
                                        clickAnalytics: true,
                                        hitsPerPage: 8,
                                        attributesToSnippet: [
                                            'product_name:10',
                                            // 'product_details:35',
                                        ],
                                        snippetEllipsisText: '…',
                                    },
                                },
                            ],
                        });
                    },
                    templates: {
                        header() {
                            return (
                                <Fragment>
                                    <span className="aa-SourceHeaderTitle">Categories</span>
                                    <div className="aa-SourceHeaderLine" />
                                </Fragment>
                            );
                        },
                        item({ item }) {

                            return (
                                <CategoryItem
                                    query={query}
                                    hit={item}
                                    insights={state.context.algoliaInsightsPlugin.insights}
                                />
                            );
                        },
                        noResults() {
                            return (
                                <div className="aa-ItemContent">
                                    No category for this query.
                                </div>
                            );
                        },
                    },
                },

            ];
        },
    });

    type ProductItemProps = {
        hit: ProductHit;
        insights: AutocompleteInsightsApi;
        components: AutocompleteComponents;
    };
    type CategoryItemProps = {
        hit: CategoryItem;
        insights: AutocompleteInsightsApi;
        components: AutocompleteComponents;
    };


    function ProductItem({ hit, insights, components }: ProductItemProps) {


        return (
            <div>
                <div class="related-image-wrapper">
                    <img
                        src={hit.image_link}
                        align="left" alt={hit.name} class="related-result-img" />
                    <div class="related-result-img-overlay"></div>
                </div>
                <div class="related-hit-names">
                    <div class="related-hit-infos">
                        <div class="related-hit-name">{hit.name}</div>
                        <div style="background: ${hit.hexColorCode ? hit.hexColorCode.split('//')[1] : ''
                  }" class="related-product-colorsHex"></div>
                    </div>
                </div>
                <div class="related-hit-price">${hit.price}</div>
            </div>

        );
    }

    function CategoryItem({ hit, insights, components }: CategoryItemProps) {
        // const { hit } = props;
        console.log(hit)
        return (
            <Fragment>
                <div className="aa-ItemContent">
                    <a href={'/#/results-page/' + hit['category']}>
                        <ul className="aa-ItemContentTitle">
                            <li>{hit.category}</li>
                        </ul>
                    </a>
                </div>
            </Fragment>
        );
    }

}