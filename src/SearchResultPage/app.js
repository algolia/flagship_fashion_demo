import { searchResults } from './searchResults';
import { burgerMenu } from '../Homepage/burgerMenu';
import { cardAnimation } from './cardAnimations';
import { togglePersona } from './persona';
import { toggleUpload } from '../Homepage/upload';
import { modalProductSearchResult } from './modalProductSearchResult';

searchResults();
burgerMenu();
togglePersona();
toggleUpload();

var checkExist = setInterval(function () {
  if (document.readyState != 'loading') {
    cardAnimation();
    modalProductSearchResult();
    clearInterval(checkExist);
  }
}, 500);
