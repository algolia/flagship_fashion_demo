import { carouselGlideJS } from './glide';
import { GetDataForCarousel } from './getCarousel';
import { carouselDetailed } from './displayCarouselDetail';
import { burgerMenu } from './burgerMenu';
import { togglePersona } from './persona';
import { cardAnimationHome } from './cardAnimationHome';
import { modalProduct } from './modalProduct';
import { autocompleteHome } from './autocomplete';

carouselGlideJS();
GetDataForCarousel();
carouselDetailed();
burgerMenu();
togglePersona();
modalProduct();
autocompleteHome();

let searchBtn = document.querySelector('#open-search');
let searchContainer = document.querySelector('#search-row');
let closeSearchRow = document.querySelector('#close_a');

searchBtn.addEventListener('click', () => {
  if (searchContainer) {
    searchContainer.style.transform = 'translateY(0px)';
  }
});

closeSearchRow.addEventListener('click', () => {
  if (searchContainer) {
    searchContainer.style.transform = 'translateY(-200px)';
  }
});

var checkExist = setInterval(function () {
  if (document.readyState === 'complete') {
    cardAnimationHome();
    modalProduct();
    clearInterval(checkExist);
  }
}, 500);
