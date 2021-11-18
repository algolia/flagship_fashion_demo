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

/** @jsx h */
import { h } from 'preact';
import { frequentlyBoughtTogether } from '@algolia/recommend-js';
import recommend from '@algolia/recommend';

export function modalProduct() {
  let cardProduct = document.querySelectorAll('.carousel-list-container li');
  let cardProductSecondCarousel = document.querySelectorAll(
    '.carousel-container li'
  );

  const searchClient = algoliasearch(
    '853MYZ81KY',
    'aed9b39a5a489d4a6c9a66d40f66edbf'
  );
  const index = searchClient.initIndex('sunrise');

  const search = instantsearch({
    indexName: 'sunrise',
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

  const getObjectID = () => {
    let carousel = document.querySelectorAll('.carousel-list-container');

    carousel.forEach((car) => {
      car.addEventListener('click', (e) => {
        let productID = e.target.dataset.id;
        // Retrieves all attributes
        index.getObject(productID).then((object) => {
          displayProduct(object, productID);
        });
        showModal();
      });
    });
    // }
  };

  function showModal() {
    let modalWrapper = document.querySelector('.modalProduct-wrapper');
    let modalProduct = document.querySelector('.modalProduct');
    let body = document.querySelector('body');

    if (
      modalWrapper.classList.contains('fadeOut') ||
      !modalWrapper.classList.contains('fadeIn')
    ) {
      modalWrapper.classList.add('fadeIn');
      modalWrapper.classList.remove('fadeOut');
      modalWrapper.classList.add('fade');
      body.style.overflowY = 'hidden';
    }

    modalWrapper.addEventListener('click', (e) => {
      if (e.target !== modalProduct && !modalProduct.contains(e.target)) {
        modalWrapper.classList.remove('fade');
        modalWrapper.classList.remove('fadeIn');
        modalWrapper.classList.add('fadeOut');
        body.style.overflowY = 'visible';
      }
    });
  }

  function displayProduct(product, productID) {
    const recommendClient = recommend(
      '853MYZ81KY',
      '1bc06bbf6de499f6b826a8a0e6902568'
    );

    const indexName = 'sunrise';

    function RelatedItem({ item }) {
      return (
        <li class="related-ais-Hits-item related-carousel-list-item">
          <div class="related-image-wrapper">
            <img
              src={item.image}
              align="left"
              alt={item.name}
              class="related-result-img"
            />
            <div class="related-result-img-overlay"></div>
          </div>
          <div class="related-hit-names">
            <div class="related-hit-infos">
              <div class="related-hit-name">{item.name}</div>
              <div
                style="background: ${
                hit.hexColorCode ? hit.hexColorCode.split('//')[1] : ''
              }"
                class="related-product-colorsHex"
              ></div>
            </div>
          </div>
          <div class="related-hit-price">{item.price}</div>
        </li>
        // <a href={item.url}>
        //   <img src={item.image_link} alt={item.name} />
        //   <div>{item.category}</div>
        //   <div>{item.name}</div>
        //   <div>${item.price}</div>
        // </a>
      );
    }

    let modalProduct = document.querySelector('.modalProduct');
    modalProduct.innerHTML = `
        <i class="fas fa-heart heart" id="wishlist-button"></i>
        <div class="productModal-global-Wrapper" id="product-modal">
            <div class="productModal-infos-Wrapper">
                <div class="productModal-image-wrapper">
                    <img
                    src="${product.image}"
                    align="left" alt="${product.name}" class="productModal-hit-img" />
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
                        <div class="productModal-hit-description">${product.brand}</div>
                        <div class="productModal-hit-rating-price">
                            <div class="productModal-hit-price">${product.price}</div>
                        </div>
                        </div>
                        <div class="productModal-hit-addToCart" data-id=${product.objectID}>
                            <a href="#"class="productModal-btn" data-id=${product.objectID}><span><p>Add to cart</p><i class="fas fa-shopping-cart"></i></span></a>
                        </div>
                    </div>
                </div>
                <div class="relatedProducts" fbt id="relatedProducts"></div>
            </div>
        `;

    frequentlyBoughtTogether({
      container: '#relatedProducts',
      recommendClient,
      indexName,
      objectIDs: [productID],
      itemComponent: RelatedItem,
    });

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
            index: 'sunrise',
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
            index: 'sunrise',
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

  getObjectID();
  search.start();
}
