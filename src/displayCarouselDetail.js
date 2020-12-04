import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import { configure, hits, EXPERIMENTAL_configureRelatedItems } from 'instantsearch.js/es/widgets';


export function carouselDetailed() {
    const searchDetail = instantsearch({
        indexName: "Gstar_demo_carousel_detail",
        searchClient: algoliasearch("HYDY1KWTWB", "28cf6d38411215e2eef188e635216508"),
    });

    searchDetail.addWidgets([
        configure({
            hitsPerPage: 8,
            query: '',
            ruleContexts: 'carousel_news'
        }),
        hits({
            container: '.carousel-container',
            templates: {
                item: (hit) => `
            
               
                <i class="fas fa-heart heart"></i>
      
            <div class="image-wrapper">
              <img src="${hit.image_link}" align="left" alt="${hit.name}" class="hit-img" />
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
          
        `

            }
        }),
    ]);

    // function activeHeart() {
    //     let heart = document.querySelector(".heart")
    //     let cards = document.querySelectorAll(".ais-Hits-item")
    //     cards.forEach(card => {
    //         card.addEventListener('mouseover', (e) => {
    //             e.preventDefault

    //             console.log(heart)
    //             this.heart.classList.add('active-heart')
    //         })
    //         card.addEventListener('mouseleave', (e) => {
    //             e.preventDefault

    //             this.heart.classList.remove('active-heart')
    //         })
    //     })
    // }

    searchDetail.start()
    // setTimeout(activeHeart, 2000)
}