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

    function colorCircle() {
        const colorInput = document.querySelectorAll('.color-list .ais-RefinementList-checkbox')
        colorInput.forEach(input => {
            console.log(input)
            console.log(input.value)
            let inputColor = input.value
            switch (inputColor) {
                case inputColor = 'Red':
                    input.value = "#FF0000"
                    input.type = 'color'
                    break;
                case inputColor = 'Beige':
                    input.value = "#F5F5DC"
                    input.type = 'color'
                    break;
                case inputColor = 'Dark blue':
                    input.value = "#000158"
                    input.type = 'color'
                    break;
                case inputColor = 'Beige':
                    input.value = "#F5F5DC"
                    input.type = 'color'
                case inputColor = 'Beige':
                    input.value = "#F5F5DC"
                    input.type = 'color'
            }
        })
    }

    setTimeout(colorCircle, 1000)

}