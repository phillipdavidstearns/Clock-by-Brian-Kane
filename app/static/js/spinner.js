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
    let rotVel_target = isNaN(parseFloat(params.speed)) ? 1.0 : Math.min(30, Math.max(-30, parseFloat(params.speed)));
    let drag = isNaN(parseFloat(params.drag)) ? 1.0 : Math.min(10.0, Math.max(0.1, parseFloat(params.drag)));
    let spinnerScale = isNaN(parseFloat(params.scale)) ? 100 : Math.min(150, Math.max(params.scale, 1));
    let frameRate = isNaN(parseFloat(params.framerate)) ? 60 : Math.min(120, Math.max(1, parseFloat(params.framerate)));
    let offsetY = isNaN(parseFloat(params.offsetY)) ? 0 : Math.min(500, Math.max(-500, parseFloat(params.offsetY)));
    let offsetX = isNaN(parseFloat(params.offsetX)) ? 0 : Math.min(500, Math.max(-500, parseFloat(params.offsetX)));
    let timer = -1;
    let lastMoveEvent = -1;

    // global elements
    const target = document.getElementById("target");
    const spinnerDiv = document.getElementById("spinner-container");
    const spinner = document.getElementById("spinner");

    // initialize the parent div of the spinner graphic
    resizeSpinner();
    startSpin();

    // Pointer Events on spinnerDiv ONLY

    function onPointerDown(e) {
      e.preventDefault();
      e.stopPropagation();
      userInteraction = true;
      lastMoveEvent = parseInt(new Date().getTime());
      stopSpin();
    }

    function onPointerUp(e) {
      e.preventDefault();
      e.stopPropagation();
      userInteraction = false;
      lastMoveEvent = -1;
      startSpin();
    }

    function onPointerCancel(e) {
      e.preventDefault();
      e.stopPropagation();
      userInteraction = false;
      lastMoveEvent = -1;
      startSpin();
    }

    function onPointerMove(e) {
      e.preventDefault();
      e.stopPropagation();
      if (userInteraction) {
        processInteractionEvent(e);
      }
    }

    // Pointer Events on spinnerDiv ONLY

    spinnerDiv.addEventListener('pointerdown', onPointerDown);
    spinnerDiv.addEventListener('pointerup', onPointerUp);
    spinnerDiv.addEventListener('pointercancel', onPointerCancel);
    spinnerDiv.addEventListener('pointermove', onPointerMove);

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
      spinnerDiv.style.setProperty('height', height, 'important');
      spinnerDiv.style.setProperty('width', width, 'important');
      spinner.style.setProperty('height', height, 'important');
      spinner.style.setProperty('width', width, 'important');

      // set position
      spinnerDiv.style.setProperty('top', `${offsetY + window.innerHeight / 2}px`, 'important');
      spinnerDiv.style.setProperty('left', `${offsetX + window.innerWidth / 2}px`, 'important');
    }

    function updateAngle(deltaAngle){
      angle += deltaAngle + 360;
      angle %= 360;

      // update spinner angle
      spinner.style.transform = `rotate(${ angle }deg)`;
    }

    function processInteractionEvent(e){
      let now = parseInt(new Date().getTime());

      var centerX = offsetX + parseFloat(spinnerDiv.style.left);
      var centerY = offsetY + parseFloat(spinnerDiv.style.top);

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

  }, false);
})();
