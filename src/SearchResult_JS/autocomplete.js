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
import { GetDataForCarousel } from '../getCarousel'
import { carousel } from "../displayCarousel";
import instantsearch from "instantsearch.js";
import { configure, index, searchBox, pagination, refinementList, stats } from "instantsearch.js/es/widgets";

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
                        indexName: "gstar_demo_test",
                        params: {
                            hitsPerPage: 3,
                            attributesToSnippet: ["name:10"],
                            enablePersonalization: true,
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
                            maxFacetHits: 5,
                            enablePersonalization: true,
                        }
                    },
                    {
                        indexName: "gstar_demo_test",
                        params: {
                            facetName: "category",
                            facetQuery: query,
                            highlightPreTag: "<mark>",
                            highlightPostTag: "</mark>",
                            maxFacetHits: 5,
                            enablePersonalization: true,
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
        onSubmit({ root, sections, state }) {

            renderHits(root, sections, state)
            // root.append(...sections);
            getQueryFromUser(state.query)
        }

    });


    function headerTemplate({ title }) {

        return `
        <div class="aa-titleCategory">
            <h3>${title}</h3>
        </div>
        ` ;
    }

    function statNbProduct({ stat }) {
        let statNb = document.querySelector('.stats-searchResult')
        statNb.innerHTML = `<p>lblblblblb ${stat}</p>`
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

    function renderHits(root, sections, state) {
        const index = searchClient.initIndex('gstar_demo_test');
        const hitContainer = document.querySelector('#hits');
        // const ul = document.createElement('ul')
        // ul.classList.add('ais-Hits-list')
        // hitContainer.appendChild(ul)
        // console.log(ul)
        index.search(state.query).then((result) => {

            const hits = result.hits
            console.log(hits)
            if (hits.length != 0) {
                displayResultOrNoResult(hits)
                const pagination = document.querySelector('#pagination')
                pagination.style.display = 'block'
                hitContainer.innerHTML = hits.map(hit =>
                    `
                <li class="carousel-list-item">
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
                                    <div>${hit.hexColorCode.split('//')[0]}</div>
                                    <div style="background: ${hit.hexColorCode.split('//')[1]}" class="hit-colorsHex"></div>
                                </div>
                                
                                
                            </div>
                        <div class="hit-price">$${hit.price}</div>
                        
                    </div>
                </a>
            </li>
                `
                ).join('')


            } else {
                noResult(hits)
            }
        })
    }



    function noResult(hits) {
        let executed = false;
        if (!executed) {
            executed = true;

            displayResultOrNoResult(hits)
            const containerNoresult = document.querySelector('.container')
            const noResults = document.querySelector('.noResultMessage')
            const query = document.querySelector(".aa-InputWrapper input").value
            const pagination = document.querySelector('#pagination')
            pagination.style.display = 'none'

            if (!noResults) {
                let noResults = document.createElement('div')
                noResults.innerHTML = ''
                noResults.classList.add('noResultMessage')
                noResults.innerHTML = `<p>Sorry no result for <span>${query}</span></p>
            <p>Please check the spelling or try to remove filters</p>
            <p>You can check our latest trends and collection bellow</p>`
                containerNoresult.prepend(noResults)
            } else {
                noResults.innerHTML = ''
                noResults.classList.add('noResultMessage')
                noResults.innerHTML = `<p>Sorry no result for <span>${query}</span></p>
            <p>Please check the spelling or try to remove filters</p>
            <p>You can check our latest trends and collection bellow</p>`
                containerNoresult.prepend(noResults)
            }

            const searchClient = algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508');

            const search = instantsearch({
                indexName: 'gstar_demo_test',
                searchClient,
            });


            // const userTokenSelector = document.getElementById("user-token-selector");
            // userTokenSelector.addEventListener("change", () => {
            //     userTokenSelector.disabled = true;
            //     search.removeWidgets(carouselWidgets);
            //     getCarouselConfigs().then((carousels) => {
            //         console.log(carousels)
            //         userTokenSelector.disabled = false;
            //         carouselWidgets = createWidgets(carousels);
            //         search.addWidgets(carouselWidgets);
            //     });
            // });

            function getUserToken() {
                const getPersona = localStorage.getItem('personaValue')
                console.log(getPersona)
                return getPersona;
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
                        console.log(carouselConfig.configure)
                        indexWidget.addWidgets([
                            configure({
                                ...carouselConfig.configure,
                                userToken: getUserToken(),
                            }),
                        ]);
                    }

                    // const client = algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508');
                    // const gstar = client.initIndex('gstar_demo_test');
                    // const gstardetail = client.initIndex('Gstar_demo_carousel_detail');

                    indexWidget.addWidgets([
                        carousel({
                            title: carouselConfig.title,
                            container: carouselContainer,
                        }),
                        // hits({
                        //     container: '#hits',
                        //     templates: carouselContainer,
                        // }),
                        // searchBox({
                        //     container: 'searchbox',
                        //     placeholder: 'Clothes, Sneakers...',
                        // }),
                        //    stats({
                        //        container: '#stats',
                        //    })


                        // refinementList({
                        //     container: '#brand-list',
                        //     attribute: 'brand',
                        // }),
                        // pagination({
                        //     container: '#pagination',
                        // }),
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
    function displayResultOrNoResult(hits) {
        const hitContainer = document.querySelector('#hits');
        const noResultCarousel = document.querySelector('#stacked-carousels')
        const noResultContainer = document.querySelector('.container')
        console.log(hits)
        if (hits.length === 0) {
            hitContainer.classList.remove('displayGrid')
            hitContainer.classList.add('displayFalse')
            noResultCarousel.classList.add('displayTrue')
            noResultCarousel.classList.remove('displayFalse')
            noResultContainer.classList.remove('displayFalse')
            noResultContainer.classList.add('displayTrue')
        } else {
            hitContainer.classList.add('displayGrid')
            hitContainer.classList.remove('displayFalse')
            noResultCarousel.classList.remove('displayGrid')
            noResultCarousel.classList.add('displayFalse')
            noResultContainer.classList.add('displayFalse')
            noResultContainer.classList.remove('displayTrue')
        }


    }

}

