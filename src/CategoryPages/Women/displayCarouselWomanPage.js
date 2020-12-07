import { connectHits } from 'instantsearch.js/es/connectors';

// import { configure, hits, EXPERIMENTAL_configureRelatedItems } from 'instantsearch.js/es/widgets';
// import instantsearch from 'instantsearch.js';
// import algoliasearch from 'algoliasearch';

export const carousel = connectHits(function renderCarousel(
    { widgetParams: { container, title }, hits },
    isFirstRender
) {
    if (isFirstRender) {
        console.log(container);
        const section = document.createElement('section');
        section.classList.add('section-carousel-winter');
        container.appendChild(section);
        const divSection = document.createElement('div')
        divSection.classList.add('title-carousel-winter')
        section.appendChild(divSection)
        const titleSection = document.createElement('h2')
        titleSection.innerText = title
        divSection.appendChild(titleSection)
        const btnSection = document.createElement('a')
        btnSection.classList.add('btn-carousel-winter')
        btnSection.innerHTML = "See All"
        btnSection.href = "./index.html"
        divSection.appendChild(btnSection)


        // document
        //   .querySelector('.title-carousel-winter').insertAdjacentHTML(
        //     'afterbegin',
        //     `<h2>${title}</h2><a href="/searchResults.html" class="btn-carousel-winter">See All</a>`
        //   );


        const ul = document.createElement('ul');
        ul.classList.add('carousel-list-container');
        section.appendChild(ul);
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


export function renderCarouselAllProduct() {

    const searchClient = algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508');

    const search = instantsearch({
        indexName: 'gstar_demo_test',
        searchClient,
    });

    search.addWidgets([
        instantsearch.widgets.searchBox({
            container: '#searchbox',
            placeholder: 'Clothes, Sneakers among women category',
        }),
        instantsearch.widgets.configure({
            hitsPerPage: 15,
            ruleContexts: ['woman_page'],
            filters: '"hierarchical_categories.lvl0":"women"'
        }),
        instantsearch.widgets.stats({
            container: '#stats-searchResultWoman',
        }),
        instantsearch.widgets.hits({
            container: '#hits',
            templates: {
                item: `
 
      <div class="image-wrapper">
          <img src="{{image_link}}" align="left" alt="{{name}}" class="result-img" />
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
        instantsearch.widgets.pagination({
            container: '#pagination',
        }),
    ]);

    search.start()
};