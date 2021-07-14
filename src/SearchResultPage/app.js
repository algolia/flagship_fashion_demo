import { searchResults } from './searchResults';
import { burgerMenu } from '../Homepage/burgerMenu';
import { cardAnimation } from './cardAnimations';
import { togglePersona } from './persona';
import { modalProductSearchResult } from './modalProductSearchResult';

searchResults();
burgerMenu();
togglePersona();

var checkExist = setInterval(function () {
  if (document.readyState != 'loading') {
    cardAnimation();
    modalProductSearchResult();
    clearInterval(checkExist);
  }
}, 500);
