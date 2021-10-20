import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import {
  configure,
  hits,
  EXPERIMENTAL_configureRelatedItems,
} from 'instantsearch.js/es/widgets';
import { connectHits } from 'instantsearch.js/es/connectors';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';
import aa from 'search-insights';

export function relatedResultModal() {
  const searchClient = algoliasearch(
    '853MYZ81KY',
    'aed9b39a5a489d4a6c9a66d40f66edbf'
  );
  const index = searchClient.initIndex('flagship_transformed_index_V2');

  const search = instantsearch({
    indexName: 'flagship_transformed_index_V2',
    searchClient,
  });

  const searchIndexSecond = instantsearch({
    indexName: 'flagship_transformed_index_V2_config',
    searchClient,
  });

  // CONFIG TO SEND INSIGHT EVENT TO THE DASHBOARD FOR PERSONALISATION
  const insightsMiddleware = createInsightsMiddleware({
    insightsClient: aa,
  });

  search.use(insightsMiddleware);
  searchIndexSecond.use(insightsMiddleware);

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
      return JSON.parse(atob(serializedPayload));
    } catch (error) {
      throw new Error(
        'The insights middleware was unable to parse `data-insights-event`.'
      );
    }
  };

  let searchInput = document.querySelector('.autocomplete input');
  let searchForm = document.querySelector('.autocomplete .aa-Form');
  let timer,
    timeoutVal = 500;

  // triggers a check to see if the user is submiting his search
  searchForm.addEventListener('submit', handleKeyUp);

  function handleKeyUp(e) {
    window.clearTimeout(timer); // prevent errant multiple timeouts from being generated
    if (e) {
      timer = window.setTimeout(() => {
        getObjectID();
        domListening();
      }, timeoutVal);
    }
  }

  // Listen to the Dom and change the content of the relatedsearch carousel with the search
  function domListening() {
    const observer = new MutationObserver((mutation) => {
      if (mutation) {
        getObjectID();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    observer.disconnect();
  }

  const getObjectID = () => {
    let productSearchResult = document.querySelectorAll('.image-wrapper');
    console.log(productSearchResult)
    productSearchResult.forEach((item) => {
     
      if (item.dataset.id !== undefined) {
        index.getObject(item.dataset.id).then((object) => {
          
          item.addEventListener('click', (e) => {
            let img = item.querySelector('img');
            if (e.target === item || e.target === img) {
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
    let ulFirst = document.querySelectorAll('.modal-relatedItems ul');

    modalWrapper.addEventListener('click', (e) => {
      if (
        (e.target !== fadeInModal && !fadeInModal.contains(e.target)) ||
        e.target === closeModal
      ) {
        modalWrapper.classList.remove('displayBlock');
        fadeInModal.classList.remove('fadeInModal');
        modalWrapper.classList.add('fadeOutModal');
        ulFirst.forEach((i) => {
          i.remove();
        });
      }
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

      const container = document.querySelector('.modal-relatedItems');
      const firstCarousel = document.querySelector('#carousel-relatedItems');
      const secondCarousel = document.querySelector(
        '#carousel-relatedItemsSecond'
      );

      if (isFirstRender) {
        let ul = document.createElement('ul');
        let ulSecondCarousel = document.createElement('ul');
        ul.classList.add('ais-Hits-list');
        ulSecondCarousel.classList.add('ais-Hits-list');
        firstCarousel.appendChild(ul);
        secondCarousel.appendChild(ulSecondCarousel);

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
          }
        });
      }

      function popUpEventClick(event, object) {
        const index = searchClient.initIndex('flagship_transformed_index_V2');
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

      document.querySelector('#carousel-relatedItems ul').innerHTML = `
      ${hits
        .map((hit) => {
          return `         
            
            <li class="ais-Hits-item carousel-list-item">   
              <div class="image-wrapper" ${bindEvent(
                'click',
                hit,
                'Product Clicked'
              )}>
                <img
                src="${hit.full_url_image}"
                align="left" alt="${hit.name}" class="result-img" />
                <div class="result-img-overlay"></div>
                <div class="hit-addToCart">
                  <a ${bindEvent(
                    'click',
                    hit,
                    'Product Added'
                  )}><i class="fas fa-ellipsis-h"></i></a>
                </div>
                <div class="hit-sizeFilter">
                    <p>Sizes available: <span>${hit.sizeFilter}</span></p>
                </div>
              </div>
              <div class="hit-name">
                  <div class="hit-infos">
                    <div>${hit.name}</div>
                        <div class="hit-colors">${hit.colourFilter}</div>
                  </div>
                  <div class="related-hit-price">$${hit.price}</div>
              </div>
            </li>
                              `;
        })
        .join('')}`;

      document.querySelector('#carousel-relatedItemsSecond ul').innerHTML = `
          ${hits
            .map((hit) => {
              return `         
                
                <li class="ais-Hits-item carousel-list-item">   
                  <div class="image-wrapper" ${bindEvent(
                    'click',
                    hit,
                    'Product Clicked'
                  )}>
                    <img
                    src="${hit.full_url_image}"
                    align="left" alt="${hit.name}" class="result-img" />
                    <div class="result-img-overlay"></div>
                    <div class="hit-addToCart">
                      <a ${bindEvent(
                        'click',
                        hit,
                        'Product Added'
                      )}><i class="fas fa-ellipsis-h"></i></a>
                    </div>
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
                </li>
                                  `;
            })
            .join('')}`;
    };

    const customHits = connectHits(renderHits);

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
      customHits({
        container: document.querySelector('#carousel-relatedItemsSecond'),
      }),
    ]);
  }

  // search.start();
  // searchIndexSecond.start();
}
