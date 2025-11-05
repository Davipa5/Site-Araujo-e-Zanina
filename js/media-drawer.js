document.addEventListener('DOMContentLoaded', function () {
  const wrappers = document.querySelectorAll('.media-drawer-wrapper');
  wrappers.forEach(initDrawer);
});

function initDrawer(wrapper) {
  const track = wrapper.querySelector('.media-track');
  const prev = wrapper.querySelector('.drawer-btn.prev');
  const next = wrapper.querySelector('.drawer-btn.next');
  const items = track.querySelectorAll('.media-item');
  if (!track || items.length === 0) return;

  let index = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let animationFrame;

  const gap = parseFloat(getComputedStyle(track).gap) || 20;
  function itemWidth() {
    return items[0].getBoundingClientRect().width + gap;
  }

  function update() {
    currentTranslate = -index * itemWidth();
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function clamp(i) {
    const maxIndex = Math.max(0, items.length - Math.floor(wrapper.querySelector('.media-drawer').getBoundingClientRect().width / items[0].getBoundingClientRect().width) );
    return Math.min(Math.max(i, 0), items.length - 1);
  }

  prev?.addEventListener('click', () => {
    index = clamp(index - 1);
    update();
  });
  next?.addEventListener('click', () => {
    index = clamp(index + 1);
    update();
  });

  // teclado
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev?.click();
    if (e.key === 'ArrowRight') next?.click();
  });
  wrapper.tabIndex = 0;

  // touch / drag
  track.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    track.style.transition = 'none';
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    track.style.transform = `translateX(${currentTranslate + dx}px)`;
  });
  track.addEventListener('pointerup', (e) => endDrag(e));
  track.addEventListener('pointercancel', (e) => endDrag(e));

  function endDrag(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    track.style.transition = '';
    isDragging = false;
    // se arrastou mais de 50px, muda o index
    if (dx < -60) index = clamp(index + 1);
    else if (dx > 60) index = clamp(index - 1);
    update();
  }

  // recomputar ao redimensionar
  window.addEventListener('resize', () => {
    // garante que index atual não saia do limite
    index = clamp(index);
    update();
  });

  // inicializa posição
  update();
}