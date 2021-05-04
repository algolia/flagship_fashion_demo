import { animationOnload } from "./animationOnLoad";
import { GetDataForCarousel } from "./getCarousel";
import { carouselDetailed } from "./displayCarouselDetail";
import { burgerMenu } from "./burgerMenu";
import { togglePersona } from "./persona";
import { cardAnimationHome } from "./cardAnimationHome";
import { modalProduct } from "./modalProduct";
import { autocompleteHome } from "./autocomplete";

animationOnload()
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




