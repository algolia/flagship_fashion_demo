import Glide, { Autoplay } from '@glidejs/glide/dist/glide.modular.esm'

// CAROUSEL IMAGES
export function carouselGlideJS() {
    const carouselGlide = new Glide('.glide', {
        type: 'carousel',
        animationDuration: 600,
        animationTimingFunc: 'linear',
        autoplay: 8000,
        hoverpause: true,
    })
    carouselGlide.mount({ Autoplay })
}