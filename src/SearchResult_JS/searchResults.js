import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import { searchBox, clearRefinements, refinementList, stats, hits, pagination } from 'instantsearch.js/es/widgets'

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



    search.start();


}