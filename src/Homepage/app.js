import { animationOnload } from './animationOnLoad';
import { GetDataForCarousel } from './getCarousel';
import { carouselDetailed } from './displayCarouselDetail';
import { burgerMenu } from './burgerMenu';
import { togglePersona } from './persona';
import { cardAnimationHome } from './cardAnimationHome';
import { modalProduct } from './modalProduct';
import { toggleUpload } from './upload';
// import { autocompleteHome } from './autocomplete';
import { autocompleteHomePage } from './autocompleteV1';

animationOnload();
GetDataForCarousel();
carouselDetailed();
burgerMenu();
togglePersona();
autocompleteHomePage();
toggleUpload();
