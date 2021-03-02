import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import {
  configure,
  hits,
  EXPERIMENTAL_configureRelatedItems,
} from 'instantsearch.js/es/widgets';
import { connectHits } from 'instantsearch.js/es/connectors';


export function relatedResultModal() {
  const searchClient = algoliasearch(
    'HYDY1KWTWB',
    '28cf6d38411215e2eef188e635216508'
  );
  const index = searchClient.initIndex('gstar_demo_test');


  const search = instantsearch({
    indexName: 'gstar_demo_test',
    searchClient,
  });

  const searchIndexSecond = instantsearch({
    indexName: 'Gstar_demo_carousel_detail',
    searchClient,
  });

  let searchInput = document.querySelector('.autocomplete input');
  let searchForm = document.querySelector('.autocomplete .aa-Form')
  let timer,
    timeoutVal = 500;
  // detects when the user is actively typing
  // searchInput.addEventListener('keypress', handleKeyPress);
  // triggers a check to see if the user is actually done typing
  searchForm.addEventListener('submit', handleKeyUp);

  function handleKeyUp(e) {
    console.log(e)
    window.clearTimeout(timer); // prevent errant multiple timeouts from being generated
    if (e) {
      timer = window.setTimeout(() => {
        getObjectID();
        domListening();
      }, timeoutVal);
    }
  }

  // function handleKeyPress(e) {
  //   window.clearTimeout(timer);
  // }

  // Listen to the Dom and change the content of the relatedsearch carousel with the search
  function domListening() {
    const observer = new MutationObserver(mutation => {
      if (mutation) {
        console.log('mutation')
        getObjectID();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    console.log('disconnect')
    observer.disconnect()
  }

  let productSearchResult = document.querySelectorAll('.image-wrapper');



  const getObjectID = () => {
    console.log('objectID')
    let productSearchResult = document.querySelectorAll('.image-wrapper');
    productSearchResult.forEach(item => {

      if (item.dataset.id !== undefined) {
        console.log(item.dataset.id)
        index.getObject(item.dataset.id).then(object => {
          item.addEventListener('click', e => {
            let img = item.querySelector('img')
            console.log(item)
            if (e.target === item || e.target === img) {
              console.log('if')
              e.preventDefault();
              displayrelateditems(object);
              displayModal();
            } else {
              e.preventDefault();
            }

          });
        });
      }
    });
  };
  getObjectID();

  // Display Modal
  function displayModal() {
    let modalWrapper = document.querySelector('.modal-relatedItems--wrapper');
    let closeModal = document.querySelector('.modal-relatedItems--closeBtn');
    let fadeInModal = document.querySelector('.modal-relatedItems');
    // modalWrapper.classList.toggle('displayBlock')

    closeModal.addEventListener('click', () => {
      modalWrapper.classList.remove('displayBlock');
      fadeInModal.classList.remove('fadeInModal');
      modalWrapper.classList.add('fadeOutModal');
    });

    if (!modalWrapper.classList.contains('displayBlock')) {
      modalWrapper.classList.add('displayBlock');
      fadeInModal.classList.add('fadeInModal');
      modalWrapper.classList.remove('fadeOutModal');
    }
  }

  // Display the related Search carousel according to the product chosen by user
  function displayrelateditems(object) {

    const renderHits = (renderOptions, isFirstRender) => {
      const {
        hits,
        widgetParams,
        bindEvent,
        instantSearchInstance,
      } = renderOptions;


      const container = document.querySelector('#carousel-relatedItems');



      if (isFirstRender) {
        container.addEventListener('click', event => {
          const targetWithEvent = findInsightsTarget(
            event.target,
            event.currentTarget,
            element => element.hasAttribute('data-insights-event')
          );

          if (targetWithEvent) {
            console.log(targetWithEvent)
            const payload = parseInsightsEvent(targetWithEvent);
            instantSearchInstance.sendEventToInsights(payload);
            popUpEventClick(payload.payload.eventName, payload.payload.objectIDs[0])
            // popUpEventCart(payload.payload.eventName, payload.payload.objectIDs[0])
          }
        });
      }

      function popUpEventClick(event, object) {
        const index = searchClient.initIndex('gstar_demo_test');
        let rightPanel = document.querySelector('.right-panel')
        let popUpWrapper = document.querySelector('.popUp-wrapper')
        index.getObject(object).then(object => {
          let div = document.createElement('div')

          if (event === 'Product Clicked') {
            div.classList.add('popUpEventClick')
            div.innerHTML = `Open product details, on ${object.name}`
          } else if (event === 'Product Added') {
            div.classList.add('popUpEventCart')
            div.innerHTML = `Add to cart product, on ${object.name}`
          }
          popUpWrapper.appendChild(div)
          div.addEventListener('animationend', () => {
            // div.remove()
          });
        });
      }

      document.querySelector('#carousel-relatedItems').innerHTML = `
      ${hits
          .map(hit => {

            return `          
                              <a href="${hit.url
              }" class="product-searchResult" data-id="${hit.objectID}">
                              <div class="image-wrapper" ${bindEvent('click', hit, 'Product Clicked')}>
                                  <img src="${hit.image_link}" align="left" alt="${hit.name
              }" class="result-img" />
                  <div class="hit-addToCart">
                  <a ${bindEvent('click', hit, 'Product Added')}><i class="fas fa-cart-arrow-down"></i></a>
              </div>
                                  <div class="hit-sizeFilter">
                                      <p>Sizes available: <span>${hit.sizeFilter}</span></p>
                                  </div>
                              </div>
                              <div class="hit-name">
                                  <div class="hit-infos">
                                  <div>${hit.name}</div>
                                      <div class="hit-colors">${hit.colourFilter
              }</div>
                                  </div>
                                  <div class="hit-price">$${hit.price}</div>
                              </div>
                          </a>
                              `;

          })
          .join('')}
  `;
    };



    const customHits = connectHits(
      renderHits
    );

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
      sizes: object.sizes,
    };

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
      customHits({
        container: document.querySelector('#carousel-relatedItems'),
      }),
      // hits({
      //   container: '#carousel-relatedItems',
      //   templates: {
      //     item: (hit, bindEvent) =>
      //       `          
      //                   <a href="${hit.url
      //       }" class="product-searchResult" data-id="${hit.objectID}">
      //                   <div class="image-wrapper" ${bindEvent('click', hit, 'Product Clicked')}>
      //                       <img src="${hit.image_link}" align="left" alt="${hit.name
      //       }" class="result-img" />
      //       <div class="hit-addToCart">
      //       <a ${bindEvent('click', hit, 'Product Added')}><i class="fas fa-cart-arrow-down"></i></a>
      //   </div>
      //                       <div class="hit-sizeFilter">
      //                           <p>Sizes available: <span>${hit.sizeFilter}</span></p>
      //                       </div>
      //                   </div>
      //                   <div class="hit-name">
      //                       <div class="hit-infos">
      //                       <div>${hit.name}</div>
      //                           <div class="hit-colors">${hit.colourFilter
      //       }</div>
      //                       </div>
      //                       <div class="hit-price">$${hit.price}</div>
      //                   </div>
      //               </a>
      //                   `,
      //   },
      // }),
    ]);
    // Add the widgets 2nd index
    searchIndexSecond.addWidgets([
      configure({
        hitsPerPage: 8,
        query: '',
      }),
      EXPERIMENTAL_configureRelatedItems({
        hit: referenceHit,
        matchingPatterns: {
          genderFilter: { score: 3 },
          category: { score: 2 },
          colourFilter: { score: 2 },
        },
      }),
      hits({
        container: '#carousel-relatedItemsSecond',
        templates: {
          item: hit =>
            `          
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
                                <div class="hit-colors">${hit.colourFilter}</div>
                            </div>
                            <div class="hit-price">$${hit.price}</div>
                        </div>
                    </a>
                        `,
        },
      }),
    ]);
  }

  search.start();
  searchIndexSecond.start();
}
