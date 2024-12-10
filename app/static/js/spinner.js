(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', async () => {

    // fetch query parameters
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    // set global variables
    let angle = 0.0; // degrees
    let rotVel = 0.0; // degrees per second
    let userSpin = false;
    let rotVel_target = isNaN(parseFloat(params.speed)) ? 1.0 : Math.min(30, Math.max(-30, parseFloat(params.speed)));
    let drag = isNaN(parseFloat(params.drag)) ? 1.0 : Math.min(10.0, Math.max(0.1, parseFloat(params.drag)));
    let spinnerScale = isNaN(parseFloat(params.scale)) ? 100 : Math.min(150, Math.max(params.scale, 1));
    let frameRate = isNaN(parseFloat(params.framerate)) ? 60 : Math.min(120, Math.max(1, parseFloat(params.framerate)));
    let offsetY = isNaN(parseFloat(params.offsetY)) ? 0 : Math.min(500, Math.max(-500, parseFloat(params.offsetY)));
    let offsetX = isNaN(parseFloat(params.offsetX)) ? 0 : Math.min(500, Math.max(-500, parseFloat(params.offsetX)));
    let timer = -1;
    let lastMoveEvent = -1;
    let holdFlag = false;
    let touchStartTimeout = -1;
    let movementX = 0;
    let movementY = 0;
    let holdRadius = 50; //pixels
    let downX = 0;
    let downY = 0;

    // global elements
    const spinnerDiv = document.getElementById("spinner-container");
    const spinner = document.getElementById("spinner");
    const frame = document.getElementById("frame");

    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    const myCarouselElement = document.querySelector('#carouselExample')

    const carousel = new bootstrap.Carousel(myCarouselElement)

    function positionActive(x, y){

      let active = document.querySelector(".active");
      active.style.left = `${x - window.innerWidth / 2}px`;
      active.style.top = `${y - window.innerHeight / 2}px`;
      console.log(`positioning... x: ${active.style.left}, y: ${active.style.top}`);

    }

    // Pointer Events on spinnerDiv ONLY


    function endHold(){
      clearTimeout(touchStartTimeout);
      touchStartTimeout = -1;
      let active = document.querySelector(".active");
      active.style.position = '';
      active.style.left = ``;
      active.style.top = ``;
      // resizeSpinner(spinnerScale);
    }

    function onPointerDown(e) {
      e.preventDefault();
      e.stopPropagation();

      //store the initial pointer coordinates
      downX = e.clientX;
      downY = e.clientY;
      movementX = 0;
      movementY = 0;

      //that a timeout that after one second:
      //1. sets a hold flag
      //2. stops user spin actions
      //3. starts default spin action
      touchStartTimeout = setTimeout(() => {
        holdFlag = true;
        userSpin = false;
        console.log('HOLDING!');
        positionActive(downX, downY);
        startSpin();
      }, 1000);

      userSpin = true;
      lastMoveEvent = parseInt(new Date().getTime());

      stopSpin();
    }

    function onPointerUp(e) {
      e.preventDefault();
      e.stopPropagation();

      if(holdFlag){
        console.log('HOLD CANCELLED');
        if(downX - e.clientX > holdRadius){
          console.log('left');
          carousel.next();
        } else if(downX - e.clientX < -holdRadius){
          console.log('right');
          carousel.prev();
        }
      }

      holdFlag = false;
      userSpin = false;
      lastMoveEvent = -1;

      endHold();
      startSpin();
    }

    function onPointerCancel(e) {
      e.preventDefault();
      e.stopPropagation();
      let holdFlag = false;
      userSpin = false;
      lastMoveEvent = -1;
      endHold();
      startSpin();
    }

    function onPointerMove(e) {
      e.preventDefault();
      e.stopPropagation();

      // accumulate movement distance in pixels on x and y axis
      movementX += e.movementX;
      movementY += e.movementY;

      // if we've not set the hold flag AND
      // there's an active touchStartTimeout AND
      // the accumulated movement exceeds the hold radius value (box)
      if( ! holdFlag && ( 
          (movementX + downX) > (downX + holdRadius) ||
          (movementY + downY) > (downY + holdRadius) ||
          (movementX + downX) < (downX - holdRadius) ||
          (movementY + downY) < (downY - holdRadius)
        )
      ) {
        console.log(`TOO MUCH MOVING! cancelling touchStartTimeout: ${touchStartTimeout}`);
        endHold();

      } else if (holdFlag){

        positionActive(e.clientX, e.clientY);

      }

      if (userSpin) {
        processInteractionEvent(e);
      }
    }

    // Pointer Events on spinnerDiv ONLY

    let innerCarousel = document.querySelector('.carousel-inner')
    innerCarousel.addEventListener('pointerdown', onPointerDown);
    innerCarousel.addEventListener('pointerup', onPointerUp);
    innerCarousel.addEventListener('pointercancel', onPointerCancel);
    innerCarousel.addEventListener('pointermove', onPointerMove);

    screen.orientation.addEventListener('change', () => {resizeSpinner(spinnerScale)});
    window.addEventListener('resize', () => {resizeSpinner(spinnerScale)});

    function resizeSpinner(scale){

      console.log(`scale: ${scale}`);

      let width = '';
      let height = '';

      if (window.innerHeight < window.innerWidth){
        height = `${parseFloat(frame.getBoundingClientRect().width) * scale / 100.0}px`;
      } else {
        width = `${parseFloat(frame.getBoundingClientRect().height) * scale / 100.0}px`;
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
