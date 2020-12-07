/* global instantsearch algoliasearch */
export function searchResults() {
    const search = instantsearch({
        indexName: 'gstar_demo_test',
        searchClient: algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508'),
    });

    search.addWidgets([
        instantsearch.widgets.searchBox({
            container: '#searchbox',
            placeholder: 'Clothes, Sneakers...',
        }),
        instantsearch.widgets.clearRefinements({
            container: '#clear-refinements',
        }),
        instantsearch.widgets.refinementList({
            container: '#brand-list',
            attribute: 'category',
        }),
        instantsearch.widgets.refinementList({
            container: '#gender-list',
            attribute: 'genderFilter',
        }),
        instantsearch.widgets.refinementList({
            container: '#color-list',
            attribute: 'colourFilter',
        }),
        instantsearch.widgets.stats({
            container: '#stats-searchResult',
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

    search.start();
}