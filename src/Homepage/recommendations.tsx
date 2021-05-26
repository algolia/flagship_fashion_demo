/** @jsx h */
import { h, Fragment, render } from 'preact';
import { relatedProducts, frequentlyBoughtTogether } from '@algolia/js-recommendations';
import { horizontalSlider } from '@algolia/ui-components-js-horizontal-slider';
import algoliasearch from 'algoliasearch';

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);

export function recommendations(productID) {
  relatedProducts({
    container: '#relatedProducts',
    searchClient,
    indexName,
    objectIDs: [productID],
    itemComponent({ item }) {
      return (
        <li class="related-ais-Hits-item related-carousel-list-item" id={`${item.objectID}`}>
          <div class="related-image-wrapper" id={`${item.objectID}`}>
            <img
              id={`${item.objectID}`}
              src={`https://flagship-fashion-demo-images.s3.amazonaws.com/images/${item.objectID
                }.jpg`}
              align="left" alt={`${item.name}`} class="related-result-img" />
            <div class="related-result-img-overlay"></div>
          </div>
          <div class="related-hit-names">
            <div class="related-hit-infos">
              <div class="related-hit-name">${item.name}</div>
              <div style="background: ${
                hit.hexColorCode ? hit.hexColorCode.split('//')[1] : ''
              }" class="related-product-colorsHex"></div>
            </div>
          </div>
          <div class="related-hit-price">${item.price}</div>
        </li>
      );
    },
  });

  frequentlyBoughtTogether({
    container: '#frequentlyBoughtTogether',
    searchClient,
    indexName,
    objectIDs: [productID],
    itemComponent({ item }) {
      return (
        <li class="related-ais-Hits-item related-carousel-list-item" id={`${item.objectID}`}>
          <div class="related-image-wrapper" id={`${item.objectID}`}>
            <img id={`${item.objectID}`}
              src={`https://flagship-fashion-demo-images.s3.amazonaws.com/images/${item.objectID
                }.jpg`}
              align="left" alt={`${item.name}`} class="related-result-img" />
            <div class="related-result-img-overlay"></div>
          </div>
          <div class="related-hit-names">
            <div class="related-hit-infos">
              <div class="related-hit-name">${item.name}</div>
              <div style="background: ${
                hit.hexColorCode ? hit.hexColorCode.split('//')[1] : ''
              }" class="related-product-colorsHex"></div>
            </div>
          </div>
          <div class="related-hit-price">${item.price}</div>
        </li>
      );
    },
  });

}