import { carouselGlideJS } from "./glide";
import { GetDataForCarousel } from "./getCarousel";
import { carouselDetailed } from "./displayCarouselDetail";
import { burgerMenu } from "./burgerMenu";
import { togglePersona } from "./persona";
import { cardAnimationHome } from "./cardAnimationHome";
import { modalProduct } from "./modalProduct";
import { autocompleteHome } from "./autocomplete";

carouselGlideJS()
GetDataForCarousel()
carouselDetailed()
burgerMenu()
togglePersona()
modalProduct()
autocompleteHome()


var checkExist = setInterval(function () {
    if (document.readyState === 'complete') {
        cardAnimationHome()
        modalProduct()
        clearInterval(checkExist);
    }
}, 500)




