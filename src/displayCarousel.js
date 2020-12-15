

import { connectHits } from 'instantsearch.js/es/connectors';

// import { configure, hits, EXPERIMENTAL_configureRelatedItems } from 'instantsearch.js/es/widgets';
// import instantsearch from 'instantsearch.js';
// import algoliasearch from 'algoliasearch';

export const carousel = connectHits(function renderCarousel(
  { widgetParams: { container, title }, hits },
  isFirstRender
) {
  if (isFirstRender) {
    console.log(title)
    console.log(container);
    container.insertAdjacentHTML('afterbegin',
      `<div class="title-carousel-winter"><h2>${title}</h2><a href="/searchResults.html" class="btn-carousel-winter">See All</a></div>`)
    const ul = document.createElement('ul');
    ul.classList.add('carousel-list-container');
    container.appendChild(ul);
  }

  container.querySelector('ul').innerHTML = hits
    .map(
      hit => `
        <li>
          <div class="image-wrapper">
            <img src="${hit.image_link}" alt="${hit.name}">
          </div>
          <div class="info">
            <h3 class="title">${hit.name}</h3>
          </div>
        </li>
      `
    )
    .join('');
});
