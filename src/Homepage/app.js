import { animationOnload } from './animationOnLoad';
import { GetDataForCarousel } from './getCarousel';
import { carouselDetailed } from './displayCarouselDetail';
import { burgerMenu } from './burgerMenu';
import { togglePersona } from './persona';
import { toggleUpload } from './uploadImage';
import { cardAnimationHome } from './cardAnimationHome';
import { modalProduct } from './modalProduct';
// import { autocompleteHome } from './autocomplete';
import { autocompleteHomePage } from './autocompleteV1';

animationOnload();
GetDataForCarousel();
carouselDetailed();
burgerMenu();
togglePersona();
toggleUpload();
// autocompleteHome();
autocompleteHomePage();

// var checkExist = setInterval(function () {
//   if (document.querySelectorAll('.carousel-list-container').length === 6) {
//     console.log(document.querySelectorAll('.carousel-list-container').length);
//     cardAnimationHome();
//     modalProduct();
//     clearInterval(checkExist);
//   }
// }, 50);
