import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import configureRelatedItems from 'instantsearch.js/es/widgets/configure-related-items/configure-related-items';
import {
  configure,
  hits,
  EXPERIMENTAL_configureRelatedItems,
} from 'instantsearch.js/es/widgets';
import { connectHits } from 'instantsearch.js/es/connectors';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';
import aa from 'search-insights';

export function modalProduct() {
  let cardProduct = document.querySelectorAll('.carousel-list-container li');
  let cardProductSecondCarousel = document.querySelectorAll(
    '.carousel-container li'
  );

  const searchClient = algoliasearch(
    'HYDY1KWTWB',
    '28cf6d38411215e2eef188e635216508'
  );
  const index = searchClient.initIndex('gstar_demo_test');

  const search = instantsearch({
    indexName: 'gstar_demo_test',
    searchClient,
  });
  // CONFIG TO SEND INSIGHT EVENT TO THE DASHBOARD FOR PERSONALISATION
  const insightsMiddleware = createInsightsMiddleware({
    insightsClient: aa,
  });

  search.use(insightsMiddleware);

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




  const personaChange = document.querySelector('.user-token-selector')
  personaChange.addEventListener('change', (e) => {
    setTimeout(getObjectID, 1000)
    e.stopPropagation()
  })




  const getObjectID = () => {
    let cardProduct = document.querySelectorAll('.carousel-list-container li');
    if (cardProduct.length > 0) {
      cardProduct.forEach((product) => {
        product.addEventListener('click', (e) => {
          let productID = e.target.dataset.id;
          // Retrieves all attributes
          index.getObject(productID).then((object) => {
            displayProduct(object);
            if (object.objectID) {
              // relatedItems(object);
              recommandedItems(object)
              boughtTogether(object)
            }
          });
          showModal();
        });

      });
    }
  }


  function showModal() {
    let modalWrapper = document.querySelector('.modalProduct-wrapper');
    let modalProduct = document.querySelector('.modalProduct');

    if (
      modalWrapper.classList.contains('fadeOut') ||
      !modalWrapper.classList.contains('fadeIn')
    ) {
      modalWrapper.classList.add('fadeIn');
      modalWrapper.classList.remove('fadeOut');
      modalWrapper.classList.add('fade');
    }

    modalWrapper.addEventListener('click', (e) => {
      if (e.target !== modalProduct && !modalProduct.contains(e.target)) {
        modalWrapper.classList.remove('fade');
        modalWrapper.classList.remove('fadeIn');
        modalWrapper.classList.add('fadeOut');
      }
    });
  }

  function displayProduct(product) {
    let modalProduct = document.querySelector('.modalProduct');
    modalProduct.innerHTML = `
        <i class="fas fa-heart heart"></i>
        <div class="productModal-global-Wrapper" id="product-modal">
            <div class="productModal-infos-Wrapper">
                <div class="productModal-image-wrapper">
                    <img src="${product.image_link}" align="left" alt="${product.name
      }" class="productModal-hit-img" />
                    <div class="productModal-img-overlay"></div>
                </div>
                <div class="productModal-info-wrapper">
                    
                    <div class="productModal-carousel-detailed-display-info">
                        <div class="productModal-hit-category">
                        ${product.category}
                        </div>
                        <div class="productModal-hit-name">
                        ${product.name}
                        </div>
                        <div class="productModal-hit-color">
                            <div class="productModal-hit-color-text">${product.hexColorCode
        ? product.hexColorCode.split('//')[0]
        : ''
      }</div>
                            <div style="background: ${product.hexColorCode
        ? product.hexColorCode.split('//')[1]
        : ''
      }" class="product-colorsHex"></div>
                        </div>
                        <div class="productModal-hit-description">${product.description
      }</div>
                        <div class="productModal-hit-rating-price">
                            <div class="productModal-hit-price">$${product.price
      }</div>
                        </div>
                        </div>

                        <div class="productModal-hit-addToCart" data-id=${product.objectID
      }>
                            <a href="#"class="productModal-btn" data-id=${product.objectID
      }><span>Add to cart  <i class="fas fa-angle-down"></i></span></a>

                        </div>
                    </div>
                </div>
            </div>
        `;

    let btnAddtoCart = document.querySelector('.productModal-btn');
    btnAddtoCart.addEventListener('click', (e) => {
      e.preventDefault();

      index
        .search('', {
          clickAnalytics: true,
        })
        .then(({ hits }) => {
          aa('clickedObjectIDs', {
            index: 'gstar_demo_test',
            eventName: 'Product Added',
            objectIDs: [e.target.dataset.id],
          });

          let popUpWrapper = document.querySelector('.popUp-wrapper');
          let div = document.createElement('div');
          div.classList.add('popUpEventCart');
          div.innerHTML = `Add to cart product, on ${product.name}`;
          popUpWrapper.appendChild(div);
          div.addEventListener('animationend', () => {
            div.remove();
          });
        });
    });
  }

  function boughtTogether(object) {
    if (object.objectID) {
      const indexBT = searchClient.initIndex('ai_recommend_bought-together_gstar_demo_test');
      let objectID = object.objectID
      indexBT.getObject(objectID).then((item) => {
        let boughtTogetherItemsArray = []
        item.recommendations.forEach(i => {
          boughtTogetherItemsArray.push(i.objectID)
        })
        index.getObjects(boughtTogetherItemsArray).then(({ results }) => {


          let container = document.querySelector('.productModal-global-Wrapper');
          let ul = document.createElement('ul');
          let title = document.createElement('h3');
          let div = document.createElement('div');

          div.classList.add('list-wrapper')
          title.innerHTML = 'Often bought together'
          ul.classList.add('boughtTogetherItems');

          div.appendChild(title)
          div.appendChild(ul);
          container.appendChild(div)

          document.querySelector('.boughtTogetherItems').innerHTML = `
          ${results
              .splice(0, 8)
              .map((hit) => {
                return `                   
            <li class="related-ais-Hits-item related-carousel-list-item">   
              <div class="related-image-wrapper">
                <img src="${hit.image_link}" align="left" alt="${hit.name
                  }" class="related-result-img" />
                <div class="related-result-img-overlay"></div>
              </div>
              <div class="related-hit-names">
                  <div class="related-hit-infos">
                    <div class="related-hit-name">${hit.name}</div>
                    <div style="background: ${hit.hexColorCode ? hit.hexColorCode.split('//')[1] : ''
                  }" class="related-product-colorsHex"></div>
                  </div>
                  </div>
                  <div class="related-hit-price">$${hit.price}</div>
            </li>
                              `;

              })
              .join('')}`;

        });

      }).catch(err => {
        console.log(err)
      });

    }
  }

  function recommandedItems(object) {

    if (object.objectID) {

      let objectID = object.objectID
      const indexRecommand = searchClient.initIndex('ai_recommend_related-products_gstar_demo_test');

      indexRecommand.getObject(objectID).then((item) => {
        let recommandItems = []
        item.recommendations.forEach(i => {
          recommandItems.push(i.objectID)
        })
        index.getObjects(recommandItems).then(({ results }) => {



          let container = document.querySelector('.productModal-global-Wrapper');
          let ul = document.createElement('ul');
          let title = document.createElement('h3')
          let div = document.createElement('div')

          div.classList.add('list-wrapper')
          title.innerHTML = 'Recommanded for you'
          ul.classList.add('recommendedItems');

          div.appendChild(title)
          div.appendChild(ul);
          container.appendChild(div)


          document.querySelector('.productModal-global-Wrapper .recommendedItems').innerHTML = `
        ${results
              .splice(0, 8)
              .map((hit) => {
                return `                   
              <li class="related-ais-Hits-item related-carousel-list-item">   
                <div class="related-image-wrapper">
                  <img src="${hit.image_link}" align="left" alt="${hit.name
                  }" class="related-result-img" />
                  <div class="related-result-img-overlay"></div>
                </div>
                <div class="related-hit-names">
                    <div class="related-hit-infos">
                      <div class="related-hit-name">${hit.name}</div>
                      <div style="background: ${hit.hexColorCode ? hit.hexColorCode.split('//')[1] : ''
                  }" class="related-product-colorsHex"></div>
                    </div>
                    </div>
                    <div class="related-hit-price">$${hit.price}</div>
              </li>
                                `;

              })
              .join('')}`;

        });
      })
    }
  }


  cardProductSecondCarousel.forEach((product) => {
    // detailProduct(product)
  });

  getObjectID();
  search.start();
}
