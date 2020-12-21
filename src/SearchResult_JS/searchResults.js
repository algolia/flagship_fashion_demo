import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import { searchBox, clearRefinements, refinementList, currentRefinements, stats, hits, pagination, voiceSearch } from 'instantsearch.js/es/widgets'
import { connectRefinementList, connectQueryRules, connectCurrentRefinements } from 'instantsearch.js/es/connectors';


export function searchResults() {


    const searchClient = algoliasearch(
        'HYDY1KWTWB',
        '28cf6d38411215e2eef188e635216508'
    );

    const search = instantsearch({
        indexName: 'gstar_demo_test',
        searchClient,
    });

    search.addWidgets([
        searchBox({
            container: '#searchbox',
            placeholder: 'Clothes, Sneakers...',
        }),
        // searchBox({
        //     container: '#searchbox-filter',
        //     placeholder: 'Woman, size...',
        // }),
        clearRefinements({
            container: '#clear-refinements',
        }),
        refinementList({
            container: '#category-list',
            attribute: 'category',
        }),
        refinementList({
            container: '#gender-list',
            attribute: 'genderFilter',
        }),
        // refinementList({
        //     container: '#color-list',
        //     attribute: 'colourFilter',
        // }),
        refinementList({
            container: '#hexColor-list',
            attribute: 'hexColorCode',
            transformItems(items) {
                return items.map(item => ({
                    ...item,
                    color: item.value.split('//')[1],
                    colorCode: item.value.split('//')[0]
                }));
            },
            templates: {
                item: `
                  <input type="color" value={{color}} class="colorInput" id="{{colorCode}}" {{#isRefined}}checked{{/isRefined}}/>
                  <label for="{{colorCode}}" class="{{#isRefined}}isRefined{{/isRefined}}">
                    {{colorCode}}
                    <span class="color" style="background-color: {{color}}"></span>
                  </label>`
            }
        }),
        refinementList({
            container: '#size-list',
            attribute: 'sizeFilter',

        }),

        // refinementList({
        //     container: '#hex-color-list',
        //     attribute: 'hexColorCode',

        // }),
        stats({
            container: '#stats-searchResult',
        }),
        voiceSearch({
            container: '#voicesearch',
            searchAsYouSpeak: true,
            language: 'en-US',
        }),
        hits({
            container: '#hits',
            transformItems(items) {
                return items.map(item => ({
                    ...item,
                    color: item.hexColorCode.split('//')[1],
                    ColorCode: item.hexColorCode.split('//')[0]
                }));
            },
            templates: {
                item: `
                 <a href="{{url}}" class="product-searchResult" data-id="{{objectID}}">
                    <div class="image-wrapper">
                        <img src="{{image_link}}" align="left" alt="{{name}}" class="result-img" />
                        <div class="hit-sizeFilter">
                            <p>Sizes available: <span>{{sizeFilter}}</span></p>
                        </div>
                    </div>
                    <div class="hit-name">
                        <div class="hit-infos">
                            <div>{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</div>
                                
                               <div class="colorWrapper">
                                    <div>{{ColorCode}}</div>
                                    <div style="background: {{color}}" class="hit-colorsHex"></div>
                                </div>
                                
                                
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
    };

    // Create the render function
    const renderQueryRuleCustomData = (renderOptions, isFirstRender) => {
        const { items, widgetParams, refine } = renderOptions;

        if (isFirstRender) {
            // const inputSearchResult = document.querySelector('.ais-SearchBox-input');

            // inputSearchResult.addEventListener('change', (e) => {
            //     if (e) {
            //         refine({
            //             ruleContexts: ['men_banner'],
            //         });
            //     } else {
            //         refine({});
            //     }
            // });
        }

        widgetParams.container.innerHTML =
            `
            <div class="banner-wrapper">
              ${items.map(item =>

                `<a href="${item.link}">
                            <div class="banner-overlay"></div>
                            <div class="banner-title--wrapper">
                                <h3>${item.title}</h3>
                                <div class="underline-bannerTitle"></div>
                            </div>
                            <img src="${item.banner}">
                        </a>`
            ).join('')}
            </div>
          `

    };

    // CURRENT REFINMENT

    const createDataAttribtues = refinement =>
        Object.keys(refinement)
            .map(key => `data-${key}="${refinement[key]}"`)
            .join(' ');

    const renderListItem = item => `
      ${item.refinements
            .map(refinement => `<li>${refinement.value.split('//')[0]} (${refinement.count})
            <button ${createDataAttribtues(refinement)} class="btnCloseRefinements">X</button></li>`)
            .join('')}
`;

    const renderCurrentRefinements = (renderOptions, isFirstRender) => {
        const { items, widgetParams, refine } = renderOptions;
        document.querySelector('#current-refinements').innerHTML = `
    <ul class="currentRefinment-filters">
      ${items.map(renderListItem).join('')}
    </ul>
  `;

        [...widgetParams.container.querySelectorAll('.btnCloseRefinements')].forEach(element => {
            element.addEventListener('click', event => {
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

    // 2. Create the custom widget
    const customRefinementList = connectRefinementList(
        renderRefinementList
    );
    const customQueryRuleCustomData = connectQueryRules(
        renderQueryRuleCustomData
    );
    const customCurrentRefinements = connectCurrentRefinements(
        renderCurrentRefinements
    );

    // 3. Instantiate
    search.addWidgets([
        customRefinementList({
            container: document.querySelector('#refinement-list-SearchResult'),
            attribute: 'keywords',
            showMoreLimit: 10,
        }),
        customQueryRuleCustomData({
            container: document.querySelector('#queryRuleCustomData'),
        }),
        customCurrentRefinements({
            container: document.querySelector('#current-refinements'),

        }),
    ]);

    search.start();




}

