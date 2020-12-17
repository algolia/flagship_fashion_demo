export function cardAnimation() {
    let cardProduct = document.querySelectorAll('.ais-Hits-item')
    cardProduct.forEach((product) => {
        console.log(product)
        product.addEventListener('mouseenter', (e) => {
            console.log(e)
            // let divSize = e.target.innerHTML
            // console.log(divSize)
            // let sizeInfos = document.querySelector(divSize, '.hit-sizeFilter')
            // sizeInfo.classList.toggle('fadeInSize')
        })
    })
}