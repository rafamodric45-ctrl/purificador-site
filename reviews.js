'use strict';
(() => {
  const section = document.querySelector('#avaliacoes');
  const cards = [...section.querySelectorAll('.review-card')];
  const photos = [...section.querySelectorAll('[data-review-photo]')];
  const more = document.querySelector('#reviews-more');
  const viewer = document.querySelector('#review-dialog');
  const largeImage = document.querySelector('#review-large-image');
  let current = 0;
  function showPhoto(index) {
    current = (index + photos.length) % photos.length;
    const photo = photos[current].querySelector('img');
    largeImage.src = photo.src;
    largeImage.alt = photo.alt;
    document.querySelector('#review-photo-title').textContent = cards[current].querySelector('.review-title').textContent;
    document.querySelector('#review-photo-counter').textContent = `${current + 1} / ${photos.length}`;
  }
  photos.forEach((button, index) => button.addEventListener('click', () => {
    showPhoto(index);
    viewer.showModal();
  }));
  more.addEventListener('click', () => {
    const expanded = more.getAttribute('aria-expanded') !== 'true';
    cards.forEach((card, index) => card.hidden = !expanded && index >= 4);
    more.setAttribute('aria-expanded', String(expanded));
    more.innerHTML = expanded ? 'Mostrar menos <span aria-hidden="true">⌃</span>' : 'Ver todas as avaliações (10) <span aria-hidden="true">⌄</span>';
    if (!expanded) section.scrollIntoView({behavior: 'smooth', block: 'start'});
  });
  document.querySelector('#review-close').addEventListener('click', () => viewer.close());
  document.querySelector('#review-prev').addEventListener('click', () => showPhoto(current - 1));
  document.querySelector('#review-next').addEventListener('click', () => showPhoto(current + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {event.preventDefault(); showPhoto(current - 1);}
    if (event.key === 'ArrowRight') {event.preventDefault(); showPhoto(current + 1);}
  });
  viewer.addEventListener('click', event => {
    const bounds = viewer.getBoundingClientRect();
    if (event.target === viewer && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) viewer.close();
  });
  let touchStart = 0;
  largeImage.addEventListener('touchstart', event => touchStart = event.changedTouches[0].clientX, {passive: true});
  largeImage.addEventListener('touchend', event => {
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 45) showPhoto(current + (distance < 0 ? 1 : -1));
  }, {passive: true});
})();
