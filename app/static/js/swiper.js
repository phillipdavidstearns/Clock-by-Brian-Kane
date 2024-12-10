(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', async () => {

  const swiper = new Swiper('.swiper', {
    speed: 400,
    spaceBetween: 100,
    allowTouchMove: true,
    centeredSlides: true,
    direction: 'horizontal',
    loop: true,
  });

  }, false);
})();
