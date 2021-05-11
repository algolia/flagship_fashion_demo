import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import { configure, hits } from 'instantsearch.js/es/widgets';
import { connectHits } from 'instantsearch.js/es/connectors';
import aa from 'search-insights';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';

export function carouselDetailed() {

    const searchClient = algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508');
    const searchDetail = instantsearch({
        indexName: "Gstar_demo_carousel_detail",
        searchClient
    });

    // CONFIG TO SEND INSIGHT EVENT TO THE DASHBOARD FOR PERSONALISATION
    const insightsMiddleware = createInsightsMiddleware({
        insightsClient: aa,
    });

    searchDetail.use(insightsMiddleware);

    const findInsightsTarget = (startElement, endElement, validator) => {
        let element = startElement;
        while (element && !validator(element)) {
            if (element === endElement) {
                return null;
            }
            element = element.parentElement;
        }
        return element;
    };

    const parseInsightsEvent = element => {
        const serializedPayload = element.getAttribute('data-insights-event');

        if (typeof serializedPayload !== 'string') {
            throw new Error(
                'The insights middleware expects `data-insights-event` to be a base64-encoded JSON string.'
            );
        }

        try {
            return JSON.parse(atob(serializedPayload));
        } catch (error) {
            throw new Error(
                'The insights middleware was unable to parse `data-insights-event`.'
            );
        }
    };

    const renderHits = (renderOptions, isFirstRender) => {
        const {
            hits,
            widgetParams,
            bindEvent,
            instantSearchInstance,
        } = renderOptions;

        const container = document.querySelector('.carousel-container')

        if (isFirstRender) {
            let ul = document.createElement('ul')
            ul.classList.add('ais-Hits-list')
            container.appendChild(ul)

            container.addEventListener('click', event => {
                const targetWithEvent = findInsightsTarget(
                    event.target,
                    event.currentTarget,
                    element => element.hasAttribute('data-insights-event')
                );

                if (targetWithEvent) {
                    const payload = parseInsightsEvent(targetWithEvent);
                    instantSearchInstance.sendEventToInsights(payload);
                    popUpEventClick(payload.payload.eventName, payload.payload.objectIDs[0])
                }
            });
        }

        function popUpEventClick(event, object) {
            const index = searchClient.initIndex('gstar_demo_test');
            let popUpWrapper = document.querySelector('.popUp-wrapper')
            index.getObject(object).then(object => {
                let div = document.createElement('div')

                if (event === 'Product Clicked') {
                    div.classList.add('popUpEventClick')
                    div.innerHTML = `Open product details, on ${object.name}`
                } else if (event === 'Product Added') {
                    div.classList.add('popUpEventCart')
                    div.innerHTML = `Add to cart product, on ${object.name}`
                }
                popUpWrapper.appendChild(div)
                div.addEventListener('animationend', () => {
                    div.remove()
                });
            });
        }

        document.querySelector('.carousel-container ul').innerHTML = `
        ${hits
                .map(hit => {

                    return `         
              
              <li class="ais-Hits-item carousel-list-item" data-id="${hit.objectID}">   
              <i class="fas fa-heart heart"></i>
      
                <div class="image-wrapper" ${bindEvent('click', hit, 'Product Clicked')}>
                    <img src="${hit.image_link}" align="left" alt="${hit.name}" class="hit-img" />
                    <div class="img-overlay"></div>
                    <div class="hit-addToCart">
                        <a ${bindEvent('click', hit, 'Product Clicked')}><i class="fas fa-ellipsis-h"></i></a>
                    </div>
                </div>
                    <div class="carousel-detailed-display-info">
                        <div class="hit-name">
                        ${hit.category}
                        </div>
                        <div class="hit-color">
                        ${hit.colourFilter}
                        </div>
                        <div class="hit-description">${hit.description}</div>
                        <div class="hit-rating-price">
                            <div class="hit-price">$${hit.price}</div>
                        </div>
                    </div>
              </li>
                                `;

                })
                .join('')}`;



    };
    const customHits = connectHits(
        renderHits
    );
    searchDetail.addWidgets([
        configure({
            hitsPerPage: 8,
            query: '',
            ruleContexts: 'carousel_news'
        }),
        customHits({
            container: document.querySelector('.carousel-container'),
        }),
    ]);

    searchDetail.start()

}