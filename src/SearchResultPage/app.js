import { searchResults } from "./searchResults";
import { filterResult } from "./filterResults";
import { burgerMenu } from "../Homepage/burgerMenu";
import { relatedResultModal } from "./relatedResultModal";
import { cardAnimation } from "./cardAnimations";



searchResults()
filterResult()
burgerMenu()

var checkExist = setInterval(function () {
    if (document.readyState != 'loading') {
        relatedResultModal()
        cardAnimation()
        clearInterval(checkExist);
    }
}, 500)

