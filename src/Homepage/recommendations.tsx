/** @jsx h */
import { h, Fragment, render } from 'preact';
import { relatedProducts, frequentlyBoughtTogether } from '@algolia/js-recommendations';
import { horizontalSlider } from '@algolia/ui-components-js-horizontal-slider';
import algoliasearch from 'algoliasearch';
import {recoBuilder} from './recoBuilder.js'

const appId = 'HYDY1KWTWB';
const apiKey = '28cf6d38411215e2eef188e635216508';
const indexName = 'gstar_demo_test';

const searchClient = algoliasearch(appId, apiKey);

import '@algolia/ui-components-js-horizontal-slider/HorizontalSlider.css';

export function recommendations(productIDs) {
  console.log(productIDs)
  
  // RELATED PRODUCTS
  recoBuilder({
    objectIDs: [productIDs],
    indexName: 'ai_recommend_related_products_gstar_demo_test_static',
    searchClient: searchClient,
    fallbackFilters: [],
    maxRecommendations: 0,
    threshold: 0,
    model: 'related-products',
    transformItems: (items) => items,
    searchParameters: {
      analytics: false,
      clickAnalytics: false,
      enableABTest: false,
      filters: [productIDs]
        .map((objectID) => `NOT objectID:${objectID}`)
        .join(' AND '),
      ruleContexts: [productIDs].map(
        (objectID) => `alg-recommend_${'bought-together'}_${objectID}`
      ),
      typoTolerance: false,
    },
 })
  .then((results) => {
    console.log(results)

    horizontalSlider({
      container: '#relatedProducts',
      items: results,
      itemComponent({ item }) {
         console.log(item)
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
                      <div class="related-hit-name">{item.name}</div>
                      <div style="background: ${
                        hit.hexColorCode ? hit.hexColorCode.split('//')[1] : ''
                      }" class="related-product-colorsHex"></div>
                    </div>
                  </div>
                  <div class="related-hit-price">${item.price}</div>
                </li>
        )
      },
    });
  })

    // FREQUENTLY BOUGHT TOGETHER
    recoBuilder({
      objectIDs: [productIDs],
      indexName: 'ai_recommend_bought-together_gstar_demo_test_static',
      searchClient: searchClient,
      fallbackFilters: [],
      maxRecommendations: 0,
      threshold: 0,
      model: 'bought-together',
      transformItems: (items) => items,
      searchParameters: {
        analytics: false,
        clickAnalytics: false,
        enableABTest: false,
        filters: [productIDs]
          .map((objectID) => `NOT objectID:${objectID}`)
          .join(' AND '),
        ruleContexts: [productIDs].map(
          (objectID) => `alg-recommend_${'bought-together'}_${objectID}`
        ),
        typoTolerance: false,
      },
   })
    .then((results) => {
      console.log(results)
  
      horizontalSlider({
        container: '#frequentlyBoughtTogether',
        items: results,
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
                        <div class="related-hit-name">{item.name}</div>
                        <div style="background: ${
                          hit.hexColorCode ? hit.hexColorCode.split('//')[1] : ''
                        }" class="related-product-colorsHex"></div>
                      </div>
                    </div>
                    <div class="related-hit-price">${item.price}</div>
                  </li>
          )
        },
      });
    })
}