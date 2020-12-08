export function burgerMenu() {
    const navslide = () => {
        const burger = document.querySelector('.burger')
        const nav = document.querySelector('.nav-list ul')
        const navlinks = document.querySelectorAll('.nav-list ul li a')
        const navlink = document.querySelectorAll('.nav-list ul li')

        burger.addEventListener('click', (e) => {
            nav.classList.toggle("nav-active")
            navlink.forEach((link, idx) => {
                if (link.style.animation) {
                    link.style.animation = ""
                } else {
                    link.style.animation = `navLinksMove 0.5s ease forwards ${idx / 5 + 0.2}s`
                }
            })
            navlinks.forEach((link, idx) => {
                if (link.style.animation) {
                    link.style.animation = ""
                } else {
                    link.style.animation = `navlinksFade 0.5s ease forwards ${idx / 5 + 0.2}s`
                }
            })

            burger.classList.toggle('toggle')
        })
    }
    navslide()
}

