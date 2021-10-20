import { carousel, renderCarouselAllProduct } from './displayCarouselManPage';
import { burgerMenu } from '../../Homepage/burgerMenu';
import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import {
  configure,
  index,
  searchBox,
  pagination,
  refinementList,
  autocomplete,
  stats,
} from 'instantsearch.js/es/widgets';

function GetDataCarousel() {
  // GET CREDENTIALS
  const searchClient = algoliasearch(
    '853MYZ81KY',
    'aed9b39a5a489d4a6c9a66d40f66edbf'
  );

  const search = instantsearch({
    indexName: 'flagship_fashion',
    searchClient,
  });

  //GET THE CONFIG
  function getCarouselConfigs() {
    return searchClient
      .initIndex('flagship_fashion_config_man')
      .search('', {
        attributesToHighlight: [],
        attributesToRetrieve: ['title', 'indexName', 'configure'],
      })
      .then((res) => res.hits);
  }

  //WIDGET CREATION
  let carouselWidgets = [];
  function createWidgets(carousels) {
    const container = document.querySelector('#stacked-carousels');

    container.innerText = '';

    return carousels.map((carouselConfig) => {
      const carouselContainer = document.createElement('div');
      carouselContainer.className = 'carousel';

      const indexWidget = index({
        indexName: carouselConfig.indexName,
        indexId: carouselConfig.objectID,
      });

      if (carouselConfig.configure) {
        indexWidget.addWidgets([
          configure({
            ...carouselConfig.configure,
          }),
        ]);
      }

      indexWidget.addWidgets([
        carousel({
          title: carouselConfig.title,
          container: carouselContainer,
        }),
      ]);

      container.appendChild(carouselContainer);
      return indexWidget;
    });
  }

  // retrieve the carousel configuration once
  getCarouselConfigs().then((carousels) => {
    carouselWidgets = createWidgets(carousels);
    search.addWidgets(carouselWidgets);
    search.start();
  });
}

// APP.JS CALL
GetDataCarousel();
burgerMenu();
renderCarouselAllProduct();
