import { carousel } from './displayCarousel';
import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import { configure, index, stats } from 'instantsearch.js/es/widgets';
import { connectAutocomplete } from 'instantsearch.js/es/connectors';
import {
  autocomplete,
  getAlgoliaResults,
  highlightHit,
} from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import '@algolia/autocomplete-theme-classic';
import { html } from 'htm/preact';

import { modalProduct } from './modalProduct';
import { cardAnimationHome } from './cardAnimationHome';

export function GetDataForCarousel() {
  // GET CREDENTIALS
  const searchClient = algoliasearch(
    '853MYZ81KY',
    'aed9b39a5a489d4a6c9a66d40f66edbf'
  );

  const search = instantsearch({
    indexName: 'sunrise',
    searchClient,
    routing: true,
  });

  const userTokenSelector = document.getElementById('user-token-selector');
  userTokenSelector.addEventListener('change', () => {
    userTokenSelector.disabled = true;
    search.removeWidgets(carouselWidgets);
    getCarouselConfigs().then((carousels) => {
      userTokenSelector.disabled = false;
      carouselWidgets = createWidgets(carousels);
      search.addWidgets(carouselWidgets);
    });
  });

  function getUserToken() {
    localStorage.setItem('personaValue', userTokenSelector.value);
    return userTokenSelector.value;
  }

  //GET THE CONFIG
  function getCarouselConfigs() {
    return searchClient
      .initIndex('flagship_fashion_config')
      .search('', {
        facetFilters: ['userToken:' + getUserToken()],
        // attributesToHighlight: [],
        attributesToRetrieve: ['title', 'indexName', 'configure', 'objectID'],
      })
      .then((res) => {
        return res.hits;
      });
  }

  //WIDGET CREATION
  let carouselWidgets = [];
  function createWidgets(carousels) {
    const container = document.querySelector('#stacked-carousels');

    container.innerText = '';

    return carousels.map((carouselConfig) => {
      const carouselContainer = document.createElement('div');
      carouselContainer.className = 'carousel';
      carouselContainer.id = `${carouselConfig.objectID}`;

      const indexWidget = index({
        indexName: carouselConfig.indexName,
        indexId: carouselConfig.objectID,
      });

      if (carouselConfig.configure) {
        console.log('config', carouselConfig.configure);
        console.log('index', carouselConfig.indexName);
        indexWidget.addWidgets([
          configure({
            ...carouselConfig.configure,
            userToken: getUserToken(),
          }),
        ]);
      }

      indexWidget.addWidgets([
        carousel({
          title: carouselConfig.title,
          container: carouselContainer,
        }),
        stats({
          container: '#stats',
        }),
      ]);

      container.appendChild(carouselContainer);
      return indexWidget;
    });
  }

  // retrieve the carousel configuration once
  getCarouselConfigs().then((carousels) => {
    userTokenSelector.disabled = false;
    carouselWidgets = createWidgets(carousels);
    search.addWidgets(carouselWidgets);
    search.start();

    cardAnimationHome();
    modalProduct();
  });
}
