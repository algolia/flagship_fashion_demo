
import algoliasearch from 'algoliasearch';
import { configure, hits, EXPERIMENTAL_configureRelatedItems } from 'instantsearch.js/es/widgets';

export function relatedResultModal() {
    const searchClient = algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508');
    const index = searchClient.initIndex('gstar_demo_test');



    const search = instantsearch({
        indexName: 'gstar_demo_test',
        searchClient
    });



    let productSearchResult = document.querySelectorAll('.product-searchResult');
    productSearchResult.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.preventDefault()
            index.getObject(item.dataset.id).then(object => {


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
                console.log(referenceHit)
                // Add the widgets
                search.addWidgets([
                    configure({
                        hitsPerPage: 15,
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
                        container: '.carousel-container',
                        templates: {
                            item: (hit) => {
                                console.log(hit)
                                    `
                                <div class="card-wrapper">
                                    <div class="img-hit">
                                    <img src="${hit.image}" align="left" alt="${hit.name}" class="hit-img" />
                                    </div>
                                    <div class="hit-name">
                                    ${hit.brand}
                                    </div>
                                    <div class="hit-description">
                                    ${hit.name}
                                    </div>
                                    <div class="hit-rating-price">
                                    <div class="hit-ratings">${ratings(hit.rating)} <p> (${hit.ratingsNumber})</p></div>
                                    <div class="hit-price">$${hit.price}</div>
                                    </div>
                                </div>
                                `}

                        }
                    }),
                ]);
            });
        })
    })

}