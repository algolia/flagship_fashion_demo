let searchBtn = document.querySelector('#open-search');
let searchContainer = document.querySelector('#search-row');
let closeSearchRow = document.querySelector('#close_a');

export function handleSearch() {
  searchBtn.addEventListener('click', () => {
    if (searchContainer) {
      searchContainer.style.transform = 'translateY(0px)';
    }
  });

  closeSearchRow.addEventListener('click', () => {
    if (searchContainer) {
      searchContainer.style.transform = 'translateY(-200px)';
    }
  });

  var checkExist = setInterval(function () {
    if (document.readyState === 'complete') {
      cardAnimationHome();
      modalProduct();
      clearInterval(checkExist);
    }
  }, 500);
}
