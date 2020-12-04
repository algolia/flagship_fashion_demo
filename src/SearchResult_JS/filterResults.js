export function filterResult() {
    let btnFilterResults = document.querySelector(".btn-filter")
    let showfilter = document.querySelector(".showfilter-wrapper")

    btnFilterResults.addEventListener('click', (e) => {
        e.preventDefault()
        if (showfilter.classList.contains('displayBlock')) {
            showfilter.classList.add('fadeOutFilter')
            showfilter.classList.remove('displayBlock')
        } else {
            showfilter.classList.add('displayBlock')
            showfilter.classList.remove('fadeOutFilter')
        }
    })
}