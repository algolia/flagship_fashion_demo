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

import { recommendations } from './recommendations.tsx';

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
  const indexName = 'gstar_demo_test';

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

  const personaChange = document.querySelector('.user-token-selector');
  personaChange.addEventListener('change', (e) => {
    setTimeout(getObjectID, 1000);
    e.stopPropagation();
  });

  const reRenderModal = (productID) => {
    // wait for rp and fbt carousels to exist, keep checking
    var checkExist = setInterval(() => {
      // select the carousels
      const recoList = document.querySelectorAll('.auc-Recommendations-list');

      // make sure both are loaded
      if (recoList.length > 0) {
        // attach click event
        recoList.forEach((node) => {
          node.addEventListener('click', showCarousel)
        });

        // stop checking for carousels
        clearInterval(checkExist);
      }
    }, 500);
  };

  const showCarousel = (event) => {

    let productID = event.target.id;
    // rerun the product display and reco display
    index.getObject(productID).then((object) => {
      displayProduct(object);
      recommendations(event.target.id);
    });
    reRenderModal()
  }

  const getObjectID = () => {
    let carousel = document.querySelectorAll('.carousel-list-container');
    carousel.forEach((car) => {
      car.addEventListener('click', (e) => {
        let productID = e.target.dataset.id;
        // Retrieves all attributes
        index.getObject(productID).then((object) => {
          displayProduct(object);
          showModal();
          recommendations(productID);
          reRenderModal(productID);
        });
      });
    });
    // }
  };

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
        <i class="fas fa-heart heart" id="wishlist-button"></i>
        <div class="productModal-global-Wrapper" id="product-modal">
            <div class="productModal-infos-Wrapper">
                <div class="productModal-image-wrapper">
                    <img
                    src="https://flagship-fashion-demo-images.s3.amazonaws.com/images/${product.objectID
      }.jpg"
                    align="left" alt="${product.name
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
                <div id="frequentlyBoughtTogether"></div>
                <div id="relatedProducts"></div>
            </div>
        `;

    let btnAddtoCart = document.querySelector('.productModal-btn');
    let btnAddtoWishlist = document.querySelector('#wishlist-button');

    btnAddtoWishlist.addEventListener('click', (e) => {
      e.preventDefault();

      index
        .search('', {
          clickAnalytics: true,
        })
        .then(({ hits }) => {
          aa('clickedObjectIDs', {
            index: 'gstar_demo_test',
            eventName: 'Product Added to Wishlist',
            objectIDs: [btnAddtoCart.dataset.id],
          });

          btnAddtoWishlist.classList.add('redWishlistButton');
          let popUpWrapper = document.querySelector('.popUp-wrapper');
          let div = document.createElement('div');
          div.classList.add('popUpEventWishlist');
          div.innerHTML = `Add to wishlist, on ${product.name}`;
          popUpWrapper.appendChild(div);
          div.addEventListener('animationend', () => {
            div.remove();
          });
        });
    });

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

  cardProductSecondCarousel.forEach((product) => {
    // detailProduct(product)
  });

  getObjectID();

  search.start();
}
