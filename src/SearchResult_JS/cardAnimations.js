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
        let cardProduct = document.querySelectorAll('.ais-Hits-item')
        cardProduct.forEach((product) => {
            let sizeInfo = product.querySelector('.hit-sizeFilter')
            product.addEventListener('mouseenter', (e) => {
                sizeInfo.classList.remove('fadeOutSize')
                sizeInfo.classList.add('fadeInSize')
            })
            product.addEventListener('mouseleave', (e) => {
                sizeInfo.classList.add('fadeOutSize')
                sizeInfo.classList.remove('fadeInSize')
            })
        })
    }
    sizeAnimation()
    domListening()
}