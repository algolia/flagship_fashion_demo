import { carouselGlideJS } from "./glide";
import { GetDataForCarousel } from "./getCarousel";
import { carouselDetailed } from "./displayCarouselDetail";
import { burgerMenu } from "./burgerMenu";
import { togglePersona } from "./persona";
import { cardAnimationHome } from "./cardAnimationHome";
import { modalProduct } from "./modalProduct";



carouselGlideJS()
GetDataForCarousel()
carouselDetailed()
burgerMenu()
togglePersona()
modalProduct()


var checkExist = setInterval(function () {
    console.log(document.readyState)
    if (document.readyState === 'complete') {
        cardAnimationHome()
        modalProduct()
        clearInterval(checkExist);
    }
}, 500)




