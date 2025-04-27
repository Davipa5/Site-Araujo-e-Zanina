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



// Observador de interseção para animações
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

// Elementos a serem observados
document.querySelectorAll('.sobre-texto, .sobre-titulo, .sobre-descricao, .sobre-imagem').forEach(element => {
  observer.observe(element);
});

// Suavizar o hover
document.querySelectorAll('.sobre-titulo').forEach(title => {
  title.addEventListener('mousemove', (e) => {
    const rect = title.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    title.style.transform = `scale(1.02) translate(${(x - rect.width/2) * 0.05}px, ${(y - rect.height/2) * 0.05}px)`;
  });
  
  title.addEventListener('mouseleave', () => {
    title.style.transform = 'scale(1)';
  });
});
