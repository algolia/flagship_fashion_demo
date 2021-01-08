import { carousel, renderCarouselAllProduct } from "./displayCarouselWomanPage";
import { burgerMenu } from "../../Homepage/burgerMenu";
import instantsearch from "instantsearch.js";
import algoliasearch from "algoliasearch";
import { configure, pagination, hits, stats, searchBox, connectHits, index } from 'instantsearch.js/es/widgets'




function GetDataCarousel() {

    // GET CREDENTIALS
    const searchClient = algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508');

    const search = instantsearch({
        indexName: 'gstar_demo_test',
        searchClient,
    });



    //GET THE CONFIG
    function getCarouselConfigs() {
        return searchClient
            .initIndex("gstar_demo_config_woman")
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
                //     container: '#searchbox',
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
        console.log(carousels)
        carouselWidgets = createWidgets(carousels);
        search.addWidgets(carouselWidgets);
        search.start();
    });


}
GetDataCarousel()
burgerMenu()
renderCarouselAllProduct()


// search.start();