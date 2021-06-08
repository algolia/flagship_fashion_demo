import { searchResults } from './searchResults';
import { colorInput } from './filterResults';
import { burgerMenu } from '../Homepage/burgerMenu';
// import { relatedResultModal } from './relatedResultModal';
import { cardAnimation } from './cardAnimations';
import { togglePersona } from './persona';
import { modalProductSearchResult } from './modalProductSearchResult';

searchResults();
// filterResult();

burgerMenu();
togglePersona();

var checkExist = setInterval(function () {
  if (document.readyState != 'loading') {
    // relatedResultModal();
    cardAnimation();
    modalProductSearchResult()
    colorInput()
    clearInterval(checkExist);
  }
}, 500);
