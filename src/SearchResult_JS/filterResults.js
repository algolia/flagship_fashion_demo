export function filterResult() {
    let btnFilterResults = document.querySelector(".btn-filter")
    let showfilter = document.querySelector(".showfilter-wrapper")
    let genderFilter = document.querySelector('.gender-wrapper')
    let genderBtn = document.querySelector('.gender')
    let categoryFilter = document.querySelector('.category-wrapper')
    let categoryBtn = document.querySelector('.category')
    let colorFilter = document.querySelector('.color-wrapper')
    let colorBtn = document.querySelector('.colors')
    let sizeFilter = document.querySelector('.size-wrapper')
    let sizeBtn = document.querySelector('.sizes')
    let sideBarFilters = document.querySelector('.sideBarFilter')
    let btnBackToFilter = document.querySelectorAll('.btn-backFilter')
    let filterItem = document.querySelectorAll('.filter-item-wrapper')


    btnFilterResults.addEventListener('click', fadeFiltersInOut)
    genderBtn.addEventListener('click', fadeFiltersGender)
    categoryBtn.addEventListener('click', fadeFiltersCategory)
    colorBtn.addEventListener('click', fadeFiltersColor)
    sizeBtn.addEventListener('click', fadeFiltersSize)
    // btnBackToFilter.addEventListener('click', backToFilters)


    btnBackToFilter.forEach(btn => {
        btn.addEventListener('click', backToFilters)
    })



    function backToFilters(e) {
        console.log(e)
        e.preventDefault()
        filterItem.forEach(filter => {
            filter.classList.remove('fadeFilters')
            filter.classList.add('fadeOutFilter')
            sideBarFilters.classList.add('fadeFilters')
            sideBarFilters.classList.remove('fadeOutFilter')
        })
    }


    function fadeFiltersInOut(e) {
        e.preventDefault()
        if (showfilter.classList.contains('fadeFilters')) {
            showfilter.classList.add('fadeOutFilter')
            showfilter.classList.remove('fadeFilters')
        } else {
            showfilter.classList.add('fadeFilters')
            showfilter.classList.remove('fadeOutFilter')
        }
    }
    function fadeFiltersGender(e) {
        e.preventDefault()
        if (genderFilter.classList.contains('fadeFilters')) {
            genderFilter.classList.remove('fadeFilters')
            genderFilter.classList.add('fadeOutFilter')
            sideBarFilters.classList.remove('fadeFilters')

        } else {
            genderFilter.classList.remove('fadeOutFilter')
            sideBarFilters.classList.add('fadeOutFilter')
            genderFilter.classList.add('fadeFilters')
            console.log(sideBarFilters)

        }
    }
    function fadeFiltersCategory(e) {
        e.preventDefault()
        if (categoryFilter.classList.contains('fadeFilters')) {
            categoryFilter.classList.remove('fadeFilters')
            categoryFilter.classList.add('fadeOutFilter')
            sideBarFilters.classList.remove('fadeFilters')

        } else {
            categoryFilter.classList.remove('fadeOutFilter')
            sideBarFilters.classList.add('fadeOutFilter')
            categoryFilter.classList.add('fadeFilters')
            console.log(sideBarFilters)

        }
    }
    function fadeFiltersColor(e) {
        e.preventDefault()
        if (colorFilter.classList.contains('fadeFilters')) {
            colorFilter.classList.remove('fadeFilters')
            colorFilter.classList.add('fadeOutFilter')
            sideBarFilters.classList.remove('fadeFilters')

        } else {
            colorFilter.classList.remove('fadeOutFilter')
            sideBarFilters.classList.add('fadeOutFilter')
            colorFilter.classList.add('fadeFilters')
            console.log(sideBarFilters)

        }
    }
    function fadeFiltersSize(e) {
        e.preventDefault()
        if (sizeFilter.classList.contains('fadeFilters')) {
            sizeFilter.classList.remove('fadeFilters')
            sizeFilter.classList.add('fadeOutFilter')
            sideBarFilters.classList.remove('fadeFilters')

        } else {
            sizeFilter.classList.remove('fadeOutFilter')
            sideBarFilters.classList.add('fadeOutFilter')
            sizeFilter.classList.add('fadeFilters')
            console.log(sideBarFilters)

        }
    }
}

    // function colorCircle() {

    //     function colorUnselected() {
    //         const colorInput = document.querySelectorAll('.color-list .ais-RefinementList-checkbox')

    //         colorInput.forEach(input => {
    //             changeColor(input)
    //             input.addEventListener('click', (e) => {
    //                 e.preventDefault()
    //                 setTimeout(colorSelected, 50)
    //             })
    //         })

    //     }

    //     function clearFilters() {
    //         const btnClear = document.querySelector('.ais-ClearRefinements-button')
    //         const refineResultColor = document.querySelectorAll('.ais-CurrentRefinements-delete')
    //         refineResultColor.forEach(close => {
    //             close.addEventListener('click', (e) => {
    //                 colorUnselected()
    //             })
    //         })
    //         btnClear.addEventListener('click', (e) => {
    //             colorUnselected()
    //         })

    //     }
    //     clearFilters()

    //     function colorSelected() {
    //         const colorInputSelected = document.querySelectorAll('.color-list .ais-RefinementList-item--selected .ais-RefinementList-checkbox')
    //         colorInputSelected.forEach(input => {

    //             changeColor(input)
    //             input.addEventListener('click', (e) => {
    //                 e.preventDefault()
    //                 setTimeout(colorUnselected, 500)
    //             })
    //         })
    //     }

    //     function changeColor(input) {
    //         let inputColor = input.value



    //         switch (inputColor) {
    //             case inputColor = 'Red':
    //                 input.value = "#FF0000"
    //                 input.type = 'color'
    //                 break;
    //             case inputColor = 'Beige':
    //                 input.value = "#F5F5DC"
    //                 input.type = 'color'
    //                 break;
    //             case inputColor = 'Dark blue':
    //                 input.value = "#000158"
    //                 input.type = 'color'
    //                 break;
    //             case inputColor = 'Grey':
    //                 input.value = "#808080"
    //                 input.type = 'color'
    //                 break;
    //             case inputColor = 'Black':
    //                 input.value = "#000"
    //                 input.type = 'color'
    //                 break;
    //             case inputColor = 'Medium blue':
    //                 input.value = "#0000CD"
    //                 input.type = 'color'
    //                 break;
    //             case inputColor = 'White':
    //                 input.value = "#FFFFFF"
    //                 input.type = 'color'
    //                 break;
    //             case inputColor = 'Green':
    //                 input.value = "#008000"
    //                 input.type = 'color'
    //                 break;
    //             case inputColor = 'Green':
    //                 input.value = "#008000"
    //                 input.type = 'color'
    //                 break;
    //             case inputColor = 'Light blue':
    //                 input.value = "#ADD8E6"
    //                 input.type = 'color'
    //                 break;
    //             case inputColor = 'Brown':
    //                 input.value = "#A0522D"
    //                 input.type = 'color'
    //                 break;

    //         }
    //     }

    //     colorUnselected()

    // }

    // setTimeout(colorCircle, 1000)

