import { searchResults } from "./searchResults";
import { filterResult } from "./filterResults";
import { burgerMenu } from "../Homepage/burgerMenu";
import { relatedResultModal } from "./relatedResultModal";
import { cardAnimation } from "./cardAnimations";
// import { autocompleteSearchResult } from "./autocomplete";
// import { searchBar } from "../searchbarDropdown";


searchResults()
filterResult()
burgerMenu()
// autocompleteSearchResult()
// searchBar()

var checkExist = setInterval(function () {
    if (document.readyState != 'loading') {
        relatedResultModal()
        cardAnimation()
        clearInterval(checkExist);
    }
}, 500)

