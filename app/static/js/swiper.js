(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', async () => {

    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    const swiper = new Swiper('.swiper', {
      speed: 400,
      spaceBetween: 100,
      allowTouchMove: true,
      centeredSlides: true,
      direction: 'horizontal',
      loop: true,
      initialSlide: parseInt(params.slide) || 0,
      focusableElements: 'input, select, option, textarea, button',
      noSwiping: true,
      noSwipingClass: 'no-swipe'
    });

  }, false);
})();
