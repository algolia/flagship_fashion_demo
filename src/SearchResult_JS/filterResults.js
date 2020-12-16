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

        function colorUnselected() {
            const colorInput = document.querySelectorAll('.color-list .ais-RefinementList-checkbox')
            colorInput.forEach(input => {
                changeColor(input)
                input.addEventListener('click', (e) => {
                    e.preventDefault()
                    setTimeout(colorSelected, 50)
                })
            })
        }


        function colorSelected() {
            const colorInputSelected = document.querySelectorAll('.color-list .ais-RefinementList-item--selected .ais-RefinementList-checkbox')
            colorInputSelected.forEach(input => {
                console.log(input)
                changeColor(input)
                input.addEventListener('click', (e) => {
                    e.preventDefault()
                    setTimeout(colorUnselected, 50)
                })
            })
        }

        function changeColor(input) {
            let inputColor = input.value
            console.log(input)


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
                case inputColor = 'Grey':
                    input.value = "#808080"
                    input.type = 'color'
                    break;
                case inputColor = 'Black':
                    input.value = "#000"
                    input.type = 'color'
                    break;
                case inputColor = 'Medium blue':
                    input.value = "#0000CD"
                    input.type = 'color'
                    break;
                case inputColor = 'White':
                    input.value = "#FFFFFF"
                    input.type = 'color'
                    break;
                case inputColor = 'Green':
                    input.value = "#008000"
                    input.type = 'color'
                    break;
                case inputColor = 'Green':
                    input.value = "#008000"
                    input.type = 'color'
                    break;
                case inputColor = 'Light blue':
                    input.value = "#ADD8E6"
                    input.type = 'color'
                    break;
                case inputColor = 'Brown':
                    input.value = "#A0522D"
                    input.type = 'color'
                    break;

            }
        }

        colorUnselected()

    }

    setTimeout(colorCircle, 1000)

}