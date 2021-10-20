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

export function modalProductSearchResult() {
  const searchClient = algoliasearch(
    '853MYZ81KY',
    'aed9b39a5a489d4a6c9a66d40f66edbf'
  );
  const index = searchClient.initIndex('flagship_fashion');

  const search = instantsearch({
    indexName: 'flagship_fashion',
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

  let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation) {
        getObjectsIDS();
      }
    });
  });

  const targetNode = document.querySelector('#hits');
  observer.observe(targetNode, {
    // characterDataOldValue: true,
    subtree: true,
    childList: true,
    // characterData: true
  });

  function getObjectsIDS() {
    let cardProduct = document.querySelectorAll('.hitsAutocomplete li');

    cardProduct.forEach((product) => {
      // detailProduct(product)
      product.addEventListener('click', (e) => {
        let productID = e.target.dataset.id;
        // Retrieves all attributes
        index.getObject(productID).then((object) => {
          console.log(object);
          displayProduct(object);
          if (object.objectID) {
            // relatedItems(object);
            recommandedItems(object);
            boughtTogether(object);
          }
        });
        showModal();
      });
    });
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
                    <img
                    src="${product.full_url_image}"
                    align="left" alt="${
                      product.name
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
                            <div class="productModal-hit-color-text">${
                              product.hexColorCode
                                ? product.hexColorCode.split('//')[0]
                                : ''
                            }</div>
                            <div style="background: ${
                              product.hexColorCode
                                ? product.hexColorCode.split('//')[1]
                                : ''
                            }" class="product-colorsHex"></div>
                        </div>
                        <div class="productModal-hit-description">${
                          product.brand
                        }</div>
                        <div class="productModal-hit-rating-price">
                            <div class="productModal-hit-price">$${
                              product.price
                            }</div>
                        </div>
                        </div>
                        <div class="productModal-hit-addToCart" data-id=${
                          product.objectID
                        }>
                            <a href="#"class="productModal-btn" data-id=${
                              product.objectID
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
            index: 'flagship_fashion',
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
      const indexBT = searchClient.initIndex(
        'ai_recommend_bought-together_flagship_transformed_index_V2'
      );
      let objectID = object.objectID;
      indexBT
        .getObject(objectID)
        .then((item) => {
          let boughtTogetherItemsArray = [];
          item.recommendations.forEach((i) => {
            boughtTogetherItemsArray.push(i.objectID);
          });
          index.getObjects(boughtTogetherItemsArray).then(({ results }) => {
            let container = document.querySelector(
              '.productModal-global-Wrapper'
            );
            let ul = document.createElement('ul');
            let title = document.createElement('h3');
            let div = document.createElement('div');

            div.classList.add('list-wrapper');
            title.innerHTML = 'Often bought together';
            ul.classList.add('boughtTogetherItems');

            div.appendChild(title);
            div.appendChild(ul);
            container.appendChild(div);

            document.querySelector('.boughtTogetherItems').innerHTML = `
          ${results
            .splice(0, 8)
            .map((hit) => {
              return `                   
            <li class="related-ais-Hits-item related-carousel-list-item">   
              <div class="related-image-wrapper">
                <img
                src="${hit.full_url_image}"
                align="left" alt="${hit.name}" class="related-result-img" />
                <div class="related-result-img-overlay"></div>
              </div>
              <div class="related-hit-names">
                  <div class="related-hit-infos">
                    <div class="related-hit-name">${hit.name}</div>
                    <div style="background: ${
                      hit.hexColorCode ? hit.hexColorCode.split('//')[1] : ''
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
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function recommandedItems(object) {
    if (object.objectID) {
      let objectID = object.objectID;
      const indexRecommand = searchClient.initIndex(
        'ai_recommend_related-products_flagship_transformed_index_V2'
      );
      indexRecommand
        .getObject(objectID)
        .then((item) => {
          let recommandItems = [];
          item.recommendations.forEach((i) => {
            recommandItems.push(i.objectID);
          });
          index.getObjects(recommandItems).then(({ results }) => {
            let container = document.querySelector(
              '.productModal-global-Wrapper'
            );
            let ul = document.createElement('ul');
            let title = document.createElement('h3');
            let div = document.createElement('div');

            div.classList.add('list-wrapper');
            title.innerHTML = 'Related products';
            ul.classList.add('recommendedItems');

            div.appendChild(title);
            div.appendChild(ul);
            container.appendChild(div);

            document.querySelector(
              '.productModal-global-Wrapper .recommendedItems'
            ).innerHTML = `
        ${results
          .splice(0, 8)
          .map((hit) => {
            return `                   
              <li class="related-ais-Hits-item related-carousel-list-item">   
                <div class="related-image-wrapper">
                  <img
                  src="${hit.full_url_image}"
                  align="left" alt="${hit.name}" class="related-result-img" />
                  <div class="related-result-img-overlay"></div>
                </div>
                <div class="related-hit-names">
                    <div class="related-hit-infos">
                      <div class="related-hit-name">${hit.name}</div>
                      <div style="background: ${
                        hit.hexColorCode ? hit.hexColorCode.split('//')[1] : ''
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
        .catch((err) => {
          console.log(err);
        });
    }
  }

  getObjectsIDS();
  search.start();
}
