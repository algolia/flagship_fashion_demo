import algoliasearch from 'algoliasearch';
import { configure, hits, EXPERIMENTAL_configureRelatedItems } from 'instantsearch.js/es/widgets';


export function relatedResultModal() {
    const searchClient = algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508');
    const index = searchClient.initIndex('gstar_demo_test');



    const search = instantsearch({
        indexName: 'gstar_demo_test',
        searchClient
    });


    let searchInput = document.querySelector('.ais-SearchBox-input')
    searchInput.addEventListener('change', (e) => {
        if (e) {
            domListening()
        }
    })

    const domListening = () => {
        // Listen to the Dom and change the content of the relatedsearch carousel with the search
        const observer = new MutationObserver(mutation => {
            if (mutation) {
                console.log(mutation)
                getObjectID()
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    const getObjectID = () => {
        let productSearchResult = document.querySelectorAll('.product-searchResult');
        productSearchResult.forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault()
                index.getObject(item.dataset.id).then(object => {
                    displayrelateditems(object);
                })
                displayModal()
            })
        })
    }
    getObjectID()



    function displayModal() {
        let modalWrapper = document.querySelector('.modal-relatedItems--wrapper');
        if (modalWrapper.classList.contains('displayBlock')) {
            modalWrapper.classList.add('fadeOutFilter')
            modalWrapper.classList.remove('displayBlock')
        } else {
            modalWrapper.classList.add('displayBlock')
            modalWrapper.classList.remove('fadeOutFilter')
        }
    }

    // Display the related Search carousel according to the product chosen by user
    function displayrelateditems(object) {

        const referenceHit = {
            objectID: object.objectID,
            category: object.category,
            colors: object.colors,
            description: object.description,
            dynamic_attributes: object.dynamic_attributes,
            genderFilter: object.genderFilter,
            name: object.name,
            keywords: object.keywords,
            default_variant: object.default_variant,
            image_link: object.image_link,
            colourFilter: object.colourFilter,
            hierarchical_categories: object.hierarchical_categories,
            non_numeric_attributes: object.non_numeric_attributes,
            price: object.price,
            priceFilter: object.priceFilter,
            sizeFilter: object.sizeFilter,
            position: object.position,
            url: object.url,
            numeric_attributes: object.numeric_attributes,
            fitFilter: object.fitFilter,
            neckFilter: object.neckFilter,
            sleeveFilter: object.sleeveFilter,
            availabilityDetail: object.availabilityDetail,
            fullStock: object.fullStock,
            sizes: object.sizes
        };
        console.log('referenceHit')

        // Add the widgets
        search.addWidgets([
            configure({
                hitsPerPage: 8,
                query: '',
            }),
            EXPERIMENTAL_configureRelatedItems({
                hit: referenceHit,
                matchingPatterns: {
                    genderFilter: { score: 3 },
                    category: { score: 2 },
                },
            }),
            hits({
                container: '#carousel-relatedItems',
                templates: {
                    item: (hit) =>

                        `          
                        <a href="${hit.url}" class="product-searchResult" data-id="${hit.objectID}">
                        <div class="image-wrapper">
                            <img src="${hit.image_link}" align="left" alt="${hit.name}" class="result-img" />
                        </div>
                        <div class="hit-name">
                            <div class="hit-infos">
                            <div>${hit.name}</div>
                                <div class="hit-colors">${hit.colourFilter}</div>
                            </div>
                            <div class="hit-price">$${hit.price}</div>
                        </div>
                    </a>
                        `
                }
            }),
        ]);

        search.start()
    }

}

