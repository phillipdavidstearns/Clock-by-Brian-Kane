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
      initialSlide: parseInt(params.slide) || 3,
      focusableElements: 'input, select, option, textarea, button',
      noSwiping: true,
      noSwipingClass: 'no-swipe',
      on: {
        init: function () {
          if(parseInt(params.slide) || 0 === 0){
            window.addEventListener('pointerdown', onPointerDown);
            window.addEventListener('pointerup', onPointerUp);
            window.addEventListener('pointercancel', onPointerCancel);
            window.addEventListener('pointermove', onPointerMove);
          }
        },
      },
    });

    swiper.on('realIndexChange', (e) => {
      if(swiper.realIndex === 0){
        window.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerCancel);
        window.addEventListener('pointermove', onPointerMove);
      } else {
        window.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerCancel);
        window.removeEventListener('pointermove', onPointerMove);       
      }
    });

    // set global variables
    let angle = 0.0; // degrees
    let rotVel = 0.0; // degrees per second
    let userSpin = false;
    let rotVel_target = Math.min(30, Math.max(-30, parseFloat(params.speed))) || 4.0 ;
    let drag =  Math.min(10.0, Math.max(0.1, parseFloat(params.drag))) || 0.5 ;
    let spinnerScale = Math.min(150, Math.max(parseFloat(params.scale), 1)) || 103;
    let frameRate = Math.min(120, Math.max(1, parseFloat(params.framerate))) || 60;
    let offsetY = Math.min(500, Math.max(-500, parseFloat(params.offsetY))) || 0;
    let offsetX = Math.min(500, Math.max(-500, parseFloat(params.offsetX))) || 0;
    let timer = -1;
    let lastMoveEvent = -1;

    // global elements
    const spinnerDiv = document.getElementById("spinner-container");
    const spinner = document.getElementById("spinner");
    const frame = document.getElementById("frame");

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Pointer Events on spinnerDiv ONLY

    function onPointerDown(e) {
      e.preventDefault();
      e.stopPropagation();
      userSpin = true;
      lastMoveEvent = parseInt(new Date().getTime());
      stopSpin();
    }

    function onPointerUp(e) {
      e.preventDefault();
      e.stopPropagation();
      userSpin = false;
      lastMoveEvent = -1;
      startSpin();
    }

    function onPointerCancel(e) {
      e.preventDefault();
      e.stopPropagation();
      userSpin = false;
      lastMoveEvent = -1;
      startSpin();
    }

    function onPointerMove(e) {
      e.preventDefault();
      e.stopPropagation();
      if (userSpin) processInteractionEvent(e);
    }

    screen.orientation.addEventListener('change', () => {resizeSpinner(spinnerScale)});
    window.addEventListener('resize', () => {resizeSpinner(spinnerScale)});

    function resizeSpinner(scale){

      let width = '';
      let height = '';

      if (window.innerHeight < window.innerWidth){
        height = `${window.innerHeight * scale * 0.01}px`;
      } else {
        width = `${window.innerWidth * scale * 0.01}px`;
      }

      // set width and height
      spinnerDiv.style.setProperty('height', height, 'important');
      spinnerDiv.style.setProperty('width', width, 'important');
      spinner.style.setProperty('height', height, 'important');
      spinner.style.setProperty('width', width, 'important');

    }

    function updateAngle(deltaAngle){
      angle += deltaAngle + 360;
      angle %= 360;

      // update spinner angle
      spinner.style.transform = `rotate(${ angle }deg)`;
    }

    function processInteractionEvent(e){
      let now = parseInt(new Date().getTime());

      var centerX = offsetX + parseFloat(frame.getBoundingClientRect().width) * 0.5 + parseFloat(frame.getBoundingClientRect().x);
      var centerY = offsetY + parseFloat(frame.getBoundingClientRect().height) * 0.5 + parseFloat(frame.getBoundingClientRect().y);

      let lastX = e.clientX + e.movementX;
      let lastY = e.clientY + e.movementY;

      let deltaAngle = getAngle(centerX, centerY, lastX, lastY, e.clientX, e.clientY);

      // calculate rorational velocity and increment angle
      rotVel = lastMoveEvent  === -1 ? rotVel : deltaAngle * (now - lastMoveEvent);
      lastMoveEvent = now;
      updateAngle(deltaAngle);
    }

    function turnSpinner() {
      // apply drag
      rotVel += (drag / frameRate) * (rotVel_target - rotVel);
      updateAngle(rotVel / frameRate);
    }

    function startSpin() {
      if (timer === -1) {
        timer = setInterval(turnSpinner, 1000 / frameRate);
      }
    }

    function stopSpin() {
      if (timer !== -1) {
        clearInterval(timer);
        timer = -1;
      }
    }

  // initialize the parent div of the spinner graphic
  resizeSpinner(spinnerScale);
  startSpin();

  }, false);
})();
