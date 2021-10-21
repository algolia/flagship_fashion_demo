import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import {
  configure,
  pagination,
  hits,
  stats,
  searchBox,
  EXPERIMENTAL_dynamicWidgets,
  panel,
  refinementList,
  clearRefinements,
  rangeSlider
} from 'instantsearch.js/es/widgets';
import { connectHits, connectCurrentRefinements } from 'instantsearch.js/es/connectors';

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
            src="${hit.full_url_image}"
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
    indexName: 'flagship_fashion',
    searchClient,
  });


  const createDataAttribtues = (refinement) =>
  Object.keys(refinement)
    .map((key) => `data-${key}="${refinement[key]}"`)
    .join(' ');

  const renderListItem = (item) => `
  ${item.refinements
    .map(
      (refinement) => `
            <li>${
              refinement.attribute === 'hexColorCode'
                ? refinement.value.split('//')[0]
                : refinement.value
            } (${refinement.count != undefined ? refinement.count : '$'})
        <button ${createDataAttribtues(
          refinement
        )} class="btnCloseRefinements">X</button></li>`
    )
    .join('')}
`;

  const renderCurrentRefinements = (renderOptions, isFirstRender) => {
    const { items, widgetParams, refine } = renderOptions;
    document.querySelector('#current-refinements').innerHTML = `
            <ul class="currentRefinment-filters">
              ${items.map(renderListItem).join('')}
            </ul>
          `;

    [
      ...widgetParams.container.querySelectorAll('.btnCloseRefinements'),
    ].forEach((element) => {
      element.addEventListener('click', (event) => {
        const item = Object.keys(event.currentTarget.dataset).reduce(
          (acc, key) => ({
            ...acc,
            [key]: event.currentTarget.dataset[key],
          }),
          {}
        );

        refine(item);
      });
    });
  };

  const customCurrentRefinements = connectCurrentRefinements(
    renderCurrentRefinements
  );


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
        <img  src={{full_url_image}}
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
    customCurrentRefinements({
      container: document.querySelector('#current-refinements'),
    }),
    clearRefinements({
      container: '#clear-refinements',
    }),
    EXPERIMENTAL_dynamicWidgets({
      container: '#dynamic-widgets',
      widgets: [
        (container) =>
          panel({
            templates: {
              header: 'Fit',
            },
          })(refinementList)({
            container,
            attribute: 'non_numeric_attributes.fitFilter',
          }),
        (container) =>
          panel({
            templates: {
              header: 'Brands',
            },
          })(refinementList)({
            container,
            attribute: 'brand',
          }),
        (container) =>
          panel({
            templates: {
              header: 'Colors',
            },
          })(refinementList)({
            container,
            attribute: 'colour',
          }),
        (container) =>
          panel({
            templates: {
              header: 'Gender',
            },
          })(refinementList)({
            container,
            attribute: 'genderFilter',
          }),
        (container) =>
          panel({
            templates: {
              header: 'Category',
            },
          })(refinementList)({
            container,
            attribute: 'categories',
          }),
        (container) =>
          panel({
            templates: {
              header: 'Price',
            },
          })(rangeSlider)({
            container,
            attribute: 'price',
            tooltips: true,
            pips: true,
          }),
        (container) =>
          panel({
            templates: {
              header: 'Color',
            },
          })(refinementList)({
            container,
            attribute: 'hexColorCode',
            transformItems(items) {
              return items.map((item) => ({
                ...item,
                color: item.value.split('//')[1],
                colorCode: item.value.split('//')[0],
              }));
            },
            templates: {
              item: `
                        <input type="color" value={{color}} class="colorInput" id="{{colorCode}}" {{#isRefined}}checked{{/isRefined}}/>
                        <label for="{{colorCode}}" class="{{#isRefined}}isRefined{{/isRefined}}">
                          {{colorCode}}
                          <span class="color" style="background-color: {{color}}"></span>
                        </label>`,
            },
          }),
        (container) =>
          panel({
            templates: {
              header: 'Sizes',
            },
          })(refinementList)({
            container,
            attribute: 'sizeFilter',
          }),
      ],
    }),
  ]);

  search.start();
}
