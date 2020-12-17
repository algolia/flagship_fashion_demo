import { searchResults } from "./searchResults";
import { filterResult } from "./filterResults";
import { burgerMenu } from "../burgerMenu";
// import { searchBar } from "../searchbarDropdown";
import { relatedResultModal } from "./relatedResultModal";
import { cardAnimation } from "./cardAnimations";


searchResults()
filterResult()
burgerMenu()
// searchBar()
// window.setInterval(relatedResultModal, 500);
// window.setInterval(cardAnimation, 500);
console.log(document.readyState)
var checkExist = setInterval(function () {
    if (document.readyState != 'loading') {
        console.log("Exists!");
        relatedResultModal()
        cardAnimation()
        clearInterval(checkExist);
    }
}, 500)



// setTimeout(relatedResultModal, 1000)
// setTimeout(cardAnimation, 1000)


// relatedResultModal()