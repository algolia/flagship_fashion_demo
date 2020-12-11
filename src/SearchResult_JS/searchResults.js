import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import { searchBox, clearRefinements, refinementList, stats, hits, pagination } from 'instantsearch.js/es/widgets'
import { connectRefinementList } from 'instantsearch.js/es/connectors';


export function searchResults() {
    const search = instantsearch({
        indexName: 'gstar_demo_test',
        searchClient: algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508'),
    });

    search.addWidgets([
        searchBox({
            container: '#searchbox',
            placeholder: 'Clothes, Sneakers...',
        }),
        clearRefinements({
            container: '#clear-refinements',
        }),
        refinementList({
            container: '#brand-list',
            attribute: 'category',
        }),
        refinementList({
            container: '#gender-list',
            attribute: 'genderFilter',
        }),
        refinementList({
            container: '#color-list',
            attribute: 'colourFilter',
        }),
        stats({
            container: '#stats-searchResult',
        }),
        hits({
            container: '#hits',
            templates: {
                item: `
         <a href="{{url}}" class="product-searchResult" data-id="{{objectID}}">
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
        </a>
            
      
        `,
            },
        }),
        pagination({
            container: '#pagination',
        }),
    ]);


    // 1. Create a render function
    const renderRefinementList = (renderOptions, isFirstRender) => {
        const {
            items,
            isFromSearch,
            refine,
            createURL,
            isShowingMore,
            canToggleShowMore,
            searchForItems,
            toggleShowMore,
            widgetParams,
        } = renderOptions;

        if (isFirstRender) {
            // const input = document.createElement('input');
            const ul = document.createElement('ul');
            // const button = document.createElement('button');
            // button.classList.add('btn-showMore')
            // button.textContent = 'Show more';

            // // input.addEventListener('input', event => {
            // //   searchForItems(event.currentTarget.value);
            // // });

            // button.addEventListener('click', () => {
            //     toggleShowMore();
            // });

            // widgetParams.container.appendChild(input);
            widgetParams.container.appendChild(ul);
            // widgetParams.container.appendChild(button);
        }

        // const input = widgetParams.container.querySelector('input');

        // if (!isFromSearch && input.value) {
        //   input.value = '';
        // }

        widgetParams.container.querySelector('ul').innerHTML = items
            .map(
                item => `
          <li style="${isRefined(item)}">
            <a
              href="${createURL(item.value)}"
              data-value="${item.value}"
              style="${isRefined(item)}"
            >
              ${item.label} <span style="${isRefined(item)}">(${item.count})</span>
            </a>
          </li>
        `
            )
            .join('');

        [...widgetParams.container.querySelectorAll('a')].forEach(element => {
            element.addEventListener('click', event => {
                event.preventDefault();
                refine(event.currentTarget.dataset.value);
            });
        });

        // const button = widgetParams.container.querySelector('button');

        // // button.disabled = !canToggleShowMore;
        // button.textContent = isShowingMore ? 'Show less' : 'Show more';
    };

    function isRefined(item) {
        if (item.isRefined) {
            return 'color: white !important; background-color: rgba(0,0,0, 0.9)'
        }
    }

    // 2. Create the custom widget
    const customRefinementList = connectRefinementList(
        renderRefinementList
    );

    // 3. Instantiate
    search.addWidgets([
        customRefinementList({
            container: document.querySelector('#refinement-list-SearchResult'),
            attribute: 'keywords',
            showMoreLimit: 10,
        })
    ]);

    search.start();

}

