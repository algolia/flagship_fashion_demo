export function togglePersona() {
    const btnPersona = document.querySelector('.btnPersona')
    const personaChoice = document.querySelector('.userPersonaSelector')
    const closePersona = document.querySelector('.closePersona')
    btnPersona.addEventListener('click', toggleModal)
    closePersona.addEventListener('click', toggleModal)



    function toggleModal(e) {
        e.preventDefault()
        if (personaChoice.classList.contains('personaFadeIn')) {
            personaChoice.classList.add('personaFadeOut')
            personaChoice.classList.remove('personaFadeIn')
        } else {
            personaChoice.classList.add('personaFadeIn')
            personaChoice.classList.remove('personaFadeOut')
        }

    }
}