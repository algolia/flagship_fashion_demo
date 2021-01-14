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
            product.addEventListener('mouseenter', (e) => {
                sizeInfo.classList.remove('fadeOutSize')
                sizeInfo.classList.add('fadeInSize')
                badges.classList.add('scaleDown')


            })
            product.addEventListener('mouseleave', (e) => {
                sizeInfo.classList.add('fadeOutSize')
                sizeInfo.classList.remove('fadeInSize')
                badges.classList.remove('scaleDown')
            })
        })
    }
    sizeAnimation()
    domListening()
}