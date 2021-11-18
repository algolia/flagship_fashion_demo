import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { connectHits } from 'instantsearch.js/es/connectors';
import aa from 'search-insights';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';

export const carousel = connectHits(function renderCarousel(
  {
    bindEvent,
    instantSearchInstance,
    widgetParams: { container, title },
    hits,
  },
  isFirstRender
) {
  const searchClient = algoliasearch(
    '853MYZ81KY',
    'aed9b39a5a489d4a6c9a66d40f66edbf'
  );

  const search = instantsearch({
    indexName: 'sunrise',
    searchClient,
    routing: true,
  });
  // CONFIG TO SEND INSIGHT EVENT TO THE DASHBOARD FOR PERSONALISATION
  const insightsMiddleware = createInsightsMiddleware({
    insightsClient: aa,
  });

  search.use(insightsMiddleware);

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

  const parseInsightsEvent = (element) => {
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

  if (isFirstRender) {
    container.insertAdjacentHTML(
      'afterbegin',
      `<div class="title-carousel-winter"><h2>${title}</h2><a href="/searchResults.html" class="btn-carousel-winter"><p>See All</p></a></div>`
    );
    const ul = document.createElement('ul');
    ul.classList.add('carousel-list-container');
    container.appendChild(ul);

    container.addEventListener('click', (event) => {
      const targetWithEvent = findInsightsTarget(
        event.target,
        event.currentTarget,
        (element) => element.hasAttribute('data-insights-event')
      );

      if (targetWithEvent) {
        const payload = parseInsightsEvent(targetWithEvent);
        instantSearchInstance.sendEventToInsights(payload);
        popUpEventClick(
          payload.payload.eventName,
          payload.payload.objectIDs[0]
        );
        // popUpEventCart(payload.payload.eventName, payload.payload.objectIDs[0])
      }
    });
  }

  function popUpEventClick(event, object) {
    const index = searchClient.initIndex('sunrise');
    let popUpWrapper = document.querySelector('.popUp-wrapper');
    index.getObject(object).then((object) => {
      let div = document.createElement('div');

      if (event === 'Product Clicked') {
        div.classList.add('popUpEventClick');
        div.innerHTML = `Open product details, on ${object.name}`;
      } else if (event === 'Product Added') {
        div.classList.add('popUpEventCart');
        div.innerHTML = `Add to cart product, on ${object.name}`;
      }
      popUpWrapper.appendChild(div);
      div.addEventListener('animationend', () => {
        div.remove();
      });
    });
  }

  console.log('carousel', hits);

  container.querySelector('ul').innerHTML = hits
    .map(
      (hit) => `
        <li data-id="${hit.objectID}">
        <i class="fas fa-heart heart"></i>
          <div class="image-wrapper" ${bindEvent(
            'click',
            hit,
            'Product Clicked'
          )} data-id="${hit.objectID}">
            <img
            src="${hit.image}"
            alt="${hit.name}" data-id="${hit.objectID}">
            <div class="img-overlay" data-id="${hit.objectID}"></div>
          </div>
          <div class="hit-addToCart">
            <a ${bindEvent(
              'click',
              hit,
              'Product Clicked'
            )}><i class="fas fa-ellipsis-h"></i></a>
          </div>
          <div class="info">
            <h3 class="title">${hit.name}</h3>
          </div>
        </li>
      `
    )
    .join('');
});
