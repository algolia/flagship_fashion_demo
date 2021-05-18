import { gsap } from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";



export function animationOnload() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".hidden-text", {
        y: 100,
        duration: 2,
        stagger: 0.2,
        ease: "power2.inOut",
        // from: 'center'
        // 0.1 seconds between when each ".box" element starts animating
    });
    gsap.from(".img4 path", {
        y: 100,
        duration: 1,
        stagger: 0.1,
        ease: "power2.inOut",
        // from: 'center'
        // 0.1 seconds between when each ".box" element starts animating
    });


    // setInterval(() => {
    //     if (document.readyState === 'complete')
    //         gsap.to(".carousel .carousel-list-container li img", {
    //             scrollTrigger: {
    //                 trigger: '.hero-banner',
    //                 start: '+=500',
    //                 // markers: true,
    //             },
    //             clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    //         });


    // }, 500)



    let img3 = document.querySelector('.img3')
    window.addEventListener('load', (e) => {
        img3.classList.add('revealBanner')
    })


}