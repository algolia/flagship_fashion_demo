
import { connectHits } from "instantsearch.js/es/connectors";
import { carouselGlideJS } from "./glide";
import { GetDataForCarousel } from "./getCarousel";
import { carouselDetailed } from "./displayCarouselDetail";
import { autoComplete } from "./autocomplete";
import { burgerMenu } from "./burgerMenu";
import { searchBar } from "./searchbarDropdown";
import { togglePersona } from "./persona";



carouselGlideJS()
GetDataForCarousel()
carouselDetailed()
autoComplete()
burgerMenu()
searchBar()
togglePersona()




/* global algoliasearch instantsearch */

// const searchClient = algoliasearch('HYDY1KWTWB', '28cf6d38411215e2eef188e635216508');

// const search = instantsearch({
//   indexName: 'gstar_demo_test',
//   searchClient,
// });

// function getCarouselConfigs() {
//   return searchClient
//     .initIndex("gstar_demo_config")
//     .search("", {
//       attributesToHighlight: [],
//       attributesToRetrieve: ["title", "indexName", "configure"],
//     })
//     .then((res) => res.hits);
// }

// function fullConfig(carouselConfig) {
//   search.addWidgets([
//     instantsearch.widgets.searchBox({
//       container: '#searchbox',
//       placeholder: 'Clothes, Sneakers...',
//     }),
//     instantsearch.widgets.configure({
//       ...carouselConfig.configure
//     }),
//     instantsearch.widgets.hits({
//       container: '#hits',
//       title: carouselConfig.title,
//       templates: {
//         item: `
//         <article>
//         <img class="hit-image" src="{{{image_link}}}">
//         <h1>{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</h1>
//         <p>{{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}</p>
//         </article>
//         `,
//       },
//     }),
//     instantsearch.widgets.refinementList({
//       container: '#brand-list',
//       attribute: 'brand',
//     }),
//     instantsearch.widgets.pagination({
//       container: '#pagination',
//     }),
//   ]);

// }


// function winterTitle(carouselConfig) {
//   let winterCarousel = document.querySelector(".ais-Hits")
//   console.log(winterCarousel)
//   let h2 = document.createElement('h2')
//   h2.innerText = carouselConfig.title
//   winterCarousel.appendChild(h2)
// }



// getCarouselConfigs().then((carousels) => {
//   carousels.map((carouselConfig) => {
//     fullConfig(carouselConfig)
//     winterTitle(carouselConfig)
//   })
// });







// search.start();

