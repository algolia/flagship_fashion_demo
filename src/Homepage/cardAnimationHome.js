export function cardAnimationHome() {



    let cardProduct = document.querySelectorAll('.carousel-list-container li')
    let cardProductSecondCarousel = document.querySelectorAll('.carousel-container li')



    cardProduct.forEach((product) => {
        animation(product)
    })
    cardProductSecondCarousel.forEach((product) => {
        animation(product)
    })

    function animation(product) {
        // let badges = product.querySelector('.badgeWrapper')
        let addToCart = product.querySelector('.hit-addToCart')
        let imgOverlay = product.querySelector('.img-overlay')
        product.addEventListener('mouseenter', (e) => {
            // if (sizeInfo) {
            //     sizeInfo.classList.remove('fadeOutSize')
            //     sizeInfo.classList.add('fadeInSize')
            // }
            // if (badges) {
            //     badges.classList.add('scaleDown')
            // }
            if (addToCart) {
                addToCart.classList.remove('fadeOutSize')
                addToCart.classList.add('fadeInSize')
                imgOverlay.style.opacity = 1

            }
        })
        product.addEventListener('mouseleave', (e) => {
            // if (sizeInfo) {
            //     sizeInfo.classList.add('fadeOutSize')
            //     sizeInfo.classList.remove('fadeInSize')
            // }
            // if (badges) {
            //     badges.classList.remove('scaleDown')
            // }
            if (addToCart) {
                addToCart.classList.add('fadeOutSize')
                addToCart.classList.remove('fadeInSize')
                imgOverlay.style.opacity = 0
            }
        })
    }

}


