export function cardAnimation() {

    function domListening() {

        const observer = new MutationObserver(mutation => {
            if (mutation) {
                sizeAnimation()
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
    function sizeAnimation() {
        let cardProduct = document.querySelectorAll('.carousel-list-item')
        cardProduct.forEach((product) => {
            let sizeInfo = product.querySelector('.hit-sizeFilter')
            let badges = product.querySelector('.badgeWrapper')
            let badgeOff = product.querySelector('.badgeWrapper .badgeOff')
            let badgeEco = product.querySelector('.badgeWrapper .badgeEco')
            let addToCart = product.querySelector('.hit-addToCart')
            let imgOverlay = product.querySelector('.result-img-overlay')
            product.addEventListener('mouseenter', (e) => {
                if (sizeInfo) {
                    sizeInfo.classList.remove('fadeOutSize')
                    sizeInfo.classList.add('fadeInSize')
                }
                if (badgeOff) {
                    badgeOff.classList.add('colorChange')
                }
                if (badgeEco) {
                    badgeEco.classList.add('colorChange')
                }
                if (addToCart) {
                    addToCart.classList.remove('fadeOutSize')
                    addToCart.classList.add('fadeInSize')
                    imgOverlay.style.opacity = 1

                }
            })
            product.addEventListener('mouseleave', (e) => {
                if (sizeInfo) {
                    sizeInfo.classList.add('fadeOutSize')
                    sizeInfo.classList.remove('fadeInSize')
                }
                if (badgeEco) {
                    badgeEco.classList.remove('colorChange')

                }
                if (badgeOff) {
                    badgeOff.classList.remove('colorChange')
                }
                if (addToCart) {
                    addToCart.classList.add('fadeOutSize')
                    addToCart.classList.remove('fadeInSize')
                    imgOverlay.style.opacity = 0
                }
            })
        })
    }

    function hideFilter() {
        //GETTER
        let hidebtn = document.querySelector(".hideFilters")
        let leftPanel = document.querySelector(".left-panel")
        let grid = document.querySelector('#hits')

        hidebtn.addEventListener("click", (e) => {
            if (leftPanel.classList.contains('fadeOutFilter')) {
                console.log('2')
                leftPanel.classList.add('fadeFilters')
                leftPanel.classList.remove('fadeOutFilter')
                leftPanel.style.display = 'flex'
                grid.classList.remove('fullScreenGrid')
                hidebtn.innerText = "HIDE"
            } else if (leftPanel.classList.contains('fadeFilters')) {
                console.log('1')
                leftPanel.classList.remove('fadeFilters')
                leftPanel.classList.add('fadeOutFilter')
                leftPanel.style.display = 'none'
                grid.classList.add('fullScreenGrid')
                hidebtn.innerText = "SHOW"
            }
            if (!leftPanel.classList.contains('fadeOutFilter') && !leftPanel.classList.contains('fadeFilters')) {
                console.log('3')
                leftPanel.classList.add('fadeOutFilter')
                leftPanel.style.display = 'none'
                grid.classList.add('fullScreenGrid')
                hidebtn.innerText = "SHOW"
            }

        })
    }
    hideFilter()
    sizeAnimation()
    domListening()
}