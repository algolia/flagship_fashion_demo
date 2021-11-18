import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import {
  configure,
  pagination,
  hits,
  stats,
  searchBox,
} from 'instantsearch.js/es/widgets';
import { connectHits } from 'instantsearch.js/es/connectors';

export const carousel = connectHits(function renderCarousel(
  { widgetParams: { container, title }, hits },
  isFirstRender
) {
  if (isFirstRender) {
    const section = document.createElement('section');
    section.classList.add('section-carousel-winter');
    container.appendChild(section);
    const divSection = document.createElement('div');
    divSection.classList.add('title-carousel-winter');
    section.appendChild(divSection);
    const titleSection = document.createElement('h2');
    titleSection.innerText = title;
    divSection.appendChild(titleSection);
    const btnSection = document.createElement('a');
    btnSection.classList.add('btn-carousel-winter');
    btnSection.innerHTML = 'See All';
    btnSection.href = './index.html';
    divSection.appendChild(btnSection);
    const ul = document.createElement('ul');
    ul.classList.add('carousel-list-container');
    section.appendChild(ul);
  }

  container.querySelector('ul').innerHTML = hits
    .map(
      (hit) => `
        <li>
          <div class="image-wrapper">
            <img
            src="${hit.image}"
            alt="${hit.name}">
          </div>
          <div class="info">
            <h3 class="title">${hit.name}</h3>
          </div>
        </li>
      `
    )
    .join('');
});

export function renderCarouselAllProduct() {
  const searchClient = algoliasearch(
    '853MYZ81KY',
    'aed9b39a5a489d4a6c9a66d40f66edbf'
  );

  const search = instantsearch({
    indexName: 'sunrise',
    searchClient,
  });

  search.addWidgets([
    searchBox({
      container: '#searchbox',
      placeholder: 'Clothes, Sneakers among women category',
    }),
    configure({
      hitsPerPage: 15,
      // ruleContexts: ['woman_page'],
      filters: '"genderFilter":"WOMEN"',
    }),
    stats({
      container: '#stats-searchResultWoman',
    }),
    hits({
      container: '#hits',
      templates: {
        item: `
 
      <div class="image-wrapper">
        <img  src={{image}}
          align="left" alt="{{name}}" class="result-img" />
      </div>
      <div class="hit-name">
          <div class="hit-infos">
         
          <div>{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</div>
              <div class="hit-colors">{{colourFilter}}</div>
          </div>
          <div class="hit-price">\${{price}}</div>
      </div>
      

  `,
      },
    }),
    pagination({
      container: '#pagination',
    }),
  ]);

  search.start();
}
