import { carousel } from "./displayCarousel";
import instantsearch from "instantsearch.js";
import algoliasearch from "algoliasearch";
import { configure, index, searchBox, pagination, refinementList, autocomplete, stats } from "instantsearch.js/es/widgets";


export function GetDataForCarousel() {
    // GET CREDENTIALS
    const searchClient = algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508');

    const search = instantsearch({
        indexName: 'gstar_demo_test',
        searchClient,
    });



    //GET THE CONFIG
    function getCarouselConfigs() {
        return searchClient
            .initIndex("gstar_demo_config")
            .search("", {
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
                        ...carouselConfig.configure
                        // userToken: getUserToken(),
                    }),
                ]);
            }

            const client = algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508');
            const gstar = client.initIndex('gstar_demo_test');
            const gstardetail = client.initIndex('Gstar_demo_carousel_detail');

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
                stats({
                    container: '#stats',
                })


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


// search.start();