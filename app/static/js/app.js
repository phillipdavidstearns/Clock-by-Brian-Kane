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
    let userInteraction = false;
    let rotVel_target = isNaN(parseFloat(params.speed)) ? 5.0 : Math.min(30, Math.max(-30, parseFloat(params.speed)));
    let drag = isNaN(parseFloat(params.drag)) ? 0.5 : Math.min(10.0, Math.max(0.1, parseFloat(params.drag)));
    let spinnerScale = isNaN(parseFloat(params.scale)) ? 100 : Math.min(150, Math.max(params.scale, 1));
    let frameRate = isNaN(parseFloat(params.framerate)) ? 60 : Math.min(120, Math.max(1, parseFloat(params.framerate)));
    let offsetY = isNaN(parseFloat(params.offsetY)) ? -1 : Math.min(500, Math.max(-500, parseFloat(params.offsetY)));
    let offsetX = isNaN(parseFloat(params.offsetX)) ? 0 : Math.min(500, Math.max(-500, parseFloat(params.offsetX)));
    let timer = -1;
    let lastMoveEvent=-1;

    // global elements
    const spinnerDiv = document.getElementById("spinner-div");
    const spinner = document.getElementById("spinner");
    const shadowDiv = document.getElementById("shadow-div")
    const shadow = document.getElementById("shadow");

    // initialize the parent div of the spinner graphic
    resizeSpinner();
    spinnerDiv.removeAttribute('hidden');
    spinnerDiv.classList.add('spinner-fade-in');
    spinnerDiv.addEventListener('animationend', (e) => {
      startSpin();
      shadowDiv.removeAttribute('hidden');
      shadowDiv.classList.add('shadow-fade-in');
    });

    // disable touch?
    window.addEventListener("touchstart", disableTouch, { passive: false });
    window.addEventListener("touchend", disableTouch, { passive: false });
    window.addEventListener("touchcancel", disableTouch, { passive: false });
    window.addEventListener("touchmove", disableTouch, { passive: false });

    function disableTouch(e){
      e.preventDefault();
      e.stopPropagation();
    };

    // Pointer Events
    window.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      userInteraction = true;
      lastMoveEvent = parseInt(new Date().getTime());
      stopSpin();
    });

    window.addEventListener('pointerup', (e) => {
      e.preventDefault();
      userInteraction = false;
      lastMoveEvent = -1;
      startSpin();
    });

    window.addEventListener('pointercancel', (e) => {
      e.preventDefault();
      userInteraction = false;
      lastMoveEvent = -1;
      startSpin();
    });

    window.addEventListener('pointermove', (e) => {
      e.preventDefault();
      if (userInteraction) {
        processInteractionEvent(e);
      }
    });

    screen.orientation.addEventListener('change', resizeSpinner);
    window.addEventListener('resize', resizeSpinner);

    function resizeSpinner(){

      let width = '';
      let height = '';

      if (window.innerHeight < window.innerWidth){
        height = `${spinnerScale}vh`;
      } else {
        width = `${spinnerScale}vw`;
      }

      // set width and height
      spinnerDiv.style.setProperty('height',height,'important');
      spinnerDiv.style.setProperty('width',width,'important');
      spinner.style.setProperty('height',height,'important');
      spinner.style.setProperty('width',width,'important');
      shadowDiv.style.setProperty('height',height,'important');
      shadowDiv.style.setProperty('width',width,'important');
      shadow.style.setProperty('height',height,'important');
      shadow.style.setProperty('width',width,'important');

      // set position
      spinnerDiv.style.setProperty('top',`${offsetY + window.innerHeight / 2}px`,'important');
      spinnerDiv.style.setProperty('left',`${offsetX + window.innerWidth / 2}px`,'important');
      shadowDiv.style.setProperty('top',`${offsetY + window.innerHeight / 2}px`,'important');
      shadowDiv.style.setProperty('left',`${offsetX + window.innerWidth / 2}px`,'important');
    }

    function updateAngle(deltaAngle){
      angle += deltaAngle + 360;
      angle %= 360;

      // update spinner angle
      spinner.style.transform = `rotate(${ angle }deg)`;
    }

    function processInteractionEvent(e){
      let now = parseInt(new Date().getTime());
      let centerX = offsetX + window.innerWidth * 0.5;
      let centerY = offsetY + window.innerHeight * 0.5;

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

    function getAngle(centerX, centerY, oldX, oldY, newX, newY){
      // treat as vectors the old and new mouse positions
      // relative to the center and calculate the angle between them

      //vector from center to new mouse location
      let x1 = newX - centerX;
      let y1 = newY - centerY;

      //vector from center to old mouse location
      let x2 = oldX - centerX;
      let y2 = oldY - centerY;

      // calculate the magnitudes of both
      let m1 = Math.sqrt(x1 * x1 + y1 * y1);
      let m2 = Math.sqrt(x2 * x2 + y2 * y2);

      // calculate the angle in radians
      let theta = Math.asin((x1 / m1) * (y2 / m2) - (y1 / m1) * (x2 / m2));
   
      // if there's a NaN resulting from divide by zero, return 0,
      // else return the angle converted to degrees
      return isNaN(theta) ? 0 : theta * 180 / Math.PI;
    }

  }, false);
})();