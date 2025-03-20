function scrollToContato() {
    const contatoSection = document.getElementById('contato');
    contatoSection.scrollIntoView({ behavior: 'smooth' });
    }


document.addEventListener('scroll', function () {
    const fixedCard = document.getElementById('fixedCard');
    const contatoSection = document.getElementById('Contato');
    const contatoPosition = contatoSection.getBoundingClientRect().top;

    // Verifica se a seção #Contato está visível na tela
    if (contatoPosition <= window.innerHeight * 0.5) {
        fixedCard.style.opacity = '0'; // Oculta o fixed-card
        fixedCard.style.visibility = 'hidden';
    } else {
        fixedCard.style.opacity = '1'; // Mostra o fixed-card
        fixedCard.style.visibility = 'visible';
    }
});
