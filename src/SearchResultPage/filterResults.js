export function filterResult() {
  let btnFilterResults = document.querySelector('.btn-filter');
  let showfilter = document.querySelector('.showfilter-wrapper');
  let genderFilter = document.querySelector('.gender-wrapper');
  let genderBtn = document.querySelector('.gender');
  let categoryFilter = document.querySelector('.category-wrapper');
  let categoryBtn = document.querySelector('.category');
  let colorFilter = document.querySelector('.color-wrapper');
  let colorBtn = document.querySelector('.colors');
  let priceFilter = document.querySelector('.price-wrapper');
  let priceBtn = document.querySelector('.prices');
  let sizeFilter = document.querySelector('.size-wrapper');
  let sizeBtn = document.querySelector('.sizes');
  let sideBarFilters = document.querySelector('.sideBarFilter');
  let btnBackToFilter = document.querySelectorAll('.btn-backFilter');
  let filterItem = document.querySelectorAll('.filter-item-wrapper');



  btnFilterResults.addEventListener('click', fadeFiltersInOut);
  genderBtn.addEventListener('click', fadeFiltersGender);
  categoryBtn.addEventListener('click', fadeFiltersCategory);
  colorBtn.addEventListener('click', fadeFiltersColor);
  sizeBtn.addEventListener('click', fadeFiltersSize);
  priceBtn.addEventListener('click', fadeFiltersPrice);


  btnBackToFilter.forEach((btn) => {
    btn.addEventListener('click', backToFilters);
  });

  function backToFilters(e) {
    e.preventDefault();
    filterItem.forEach((filter) => {
      filter.classList.remove('fadeFilters');
      filter.classList.add('fadeOutFilter');
      sideBarFilters.classList.add('fadeFilters');
      sideBarFilters.classList.remove('fadeOutFilter');
    });
  }

  function fadeFiltersInOut(e) {
    e.preventDefault();
    if (showfilter.classList.contains('fadeFilters')) {
      showfilter.classList.add('fadeOutFilter');
      showfilter.classList.remove('fadeFilters');
    } else {
      showfilter.classList.add('fadeFilters');
      showfilter.classList.remove('fadeOutFilter');
    }
  }
  function fadeFiltersGender(e) {
    e.preventDefault();
    if (genderFilter.classList.contains('fadeFilters')) {
      genderFilter.classList.remove('fadeFilters');
      genderFilter.classList.add('fadeOutFilter');
      sideBarFilters.classList.remove('fadeFilters');
    } else {
      genderFilter.classList.remove('fadeOutFilter');
      sideBarFilters.classList.add('fadeOutFilter');
      genderFilter.classList.add('fadeFilters');
    }
  }
  function fadeFiltersCategory(e) {
    e.preventDefault();
    if (categoryFilter.classList.contains('fadeFilters')) {
      categoryFilter.classList.remove('fadeFilters');
      categoryFilter.classList.add('fadeOutFilter');
      sideBarFilters.classList.remove('fadeFilters');
    } else {
      categoryFilter.classList.remove('fadeOutFilter');
      sideBarFilters.classList.add('fadeOutFilter');
      categoryFilter.classList.add('fadeFilters');
    }
  }
  function fadeFiltersColor(e) {
    e.preventDefault();
    if (colorFilter.classList.contains('fadeFilters')) {
      colorFilter.classList.remove('fadeFilters');
      colorFilter.classList.add('fadeOutFilter');
      sideBarFilters.classList.remove('fadeFilters');
    } else {
      colorFilter.classList.remove('fadeOutFilter');
      sideBarFilters.classList.add('fadeOutFilter');
      colorFilter.classList.add('fadeFilters');
    }
  }
  function fadeFiltersSize(e) {
    e.preventDefault();
    if (sizeFilter.classList.contains('fadeFilters')) {
      sizeFilter.classList.remove('fadeFilters');
      sizeFilter.classList.add('fadeOutFilter');
      sideBarFilters.classList.remove('fadeFilters');
    } else {
      sizeFilter.classList.remove('fadeOutFilter');
      sideBarFilters.classList.add('fadeOutFilter');
      sizeFilter.classList.add('fadeFilters');
    }
  }
  function fadeFiltersPrice(e) {
    e.preventDefault();
    if (priceFilter.classList.contains('fadeFilters')) {
      priceFilter.classList.remove('fadeFilters');
      priceFilter.classList.add('fadeOutFilter');
      sideBarFilters.classList.remove('fadeFilters');
    } else {
      priceFilter.classList.remove('fadeOutFilter');
      sideBarFilters.classList.add('fadeOutFilter');
      priceFilter.classList.add('fadeFilters');
    }
  }
}
