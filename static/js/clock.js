// https://www.cssscript.com/ios-os-x-style-pure-css-loading-spinner/#google_vignette

(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', async () => {

    // fetch query parameters
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    // set global variables
    
    let angle = 0.0;
    let userInteraction = false;

    let padding = isNaN(parseFloat(params.padding)) ? 0.0175 : Math.min(0.1, Math.max(0.0, parseFloat(params.padding)));
    let heightRatio = isNaN(parseFloat(params.heightRatio)) ? 0.625 : Math.min(0.99, Math.max(0.01, parseFloat(params.heightRatio)));
    let widthRatio = isNaN(parseFloat(params.widthRatio)) ? 0.3125 : Math.min(1.0, Math.max(0.0, parseFloat(params.widthRatio)));
    let scale = isNaN(parseFloat(params.scale)) ? 95 : Math.min(150, Math.max(10, parseFloat(params.scale)));
    let frameRate = isNaN(parseFloat(params.framerate)) ? 30 : Math.min(120, Math.max(1, parseFloat(params.framerate)));
    let offsetY = isNaN(parseFloat(params.offsetY)) ? 0 : Math.min(500, Math.max(-500, parseFloat(params.offsetY)));
    let offsetX = isNaN(parseFloat(params.offsetX)) ? 0 : Math.min(500, Math.max(-500, parseFloat(params.offsetX)));
    let timer = -1;
    let lastMoveEvent= -1;

    let hourOffset = 0.0;
    let minuteOffset = 0.0;
    let secondOffset = 0.0;

    // global elements
    const clock = document.getElementById("clock");
    const center = document.getElementById("center");

    const hours = generateBlades(center, 12);
    const minutes = generateBlades(center, 12);
    const seconds = generateBlades(center, 12);
    const millis = generateBlades(center, 12);

    function scaleBlades( blades, radius, heightRatio, widthRatio, paddingRatio){
      let padding = radius * paddingRatio;
      let height = heightRatio * radius;
      let width = height * widthRatio;
      let offset = radius - height / 2;
      for (const blade of blades){
        blade.style.setProperty('translate', `0 ${-offset-padding}px`, 'important');
        blade.style.setProperty('height', `${height-padding}px`, 'important');
        blade.style.setProperty('width', `${width}px`, 'important');
      }
    }

    function colorBlades(blades, unit){
      let now = new Date();
      let value = null;
      let div = null;

      switch(unit){
        case 'hours':
          value = ((now.getHours() + ((now.getMinutes() + (now.getSeconds() + now.getMilliseconds() * 0.001) / 60) / 60)) % 12) / 12;
          break;
        case 'minutes':
          value = (now.getMinutes() + (now.getSeconds() + now.getMilliseconds() * 0.001) / 60) / 60 ;
          break
        case 'seconds':
          value = (now.getSeconds() + now.getMilliseconds() * 0.001) / 60;
          break;
        case 'millis':
          value = now.getMilliseconds() * 0.001;
          break;
      }

      for(let i = blades.length - 1; i >= 0 ; i--){
        let alpha = ((i / blades.length) + 1 - value) % 1;
        blades[i].style.setProperty('background-color',`rgba(255, 255, 255, ${alpha})`);
      }

    }
    
    // initialize the parent div of the clock graphic
    resizeClock();
    startClock();

    // disable touch?
    // window.addEventListener("touchstart", disableTouch, { passive: false });
    // window.addEventListener("touchend", disableTouch, { passive: false });
    // window.addEventListener("touchcancel", disableTouch, { passive: false });
    // window.addEventListener("touchmove", disableTouch, { passive: false });

    // function disableTouch(e){
    //   e.preventDefault();
    //   e.stopPropagation();
    // };

    // Pointer Events
    // window.addEventListener('pointerdown', (e) => {
    //   e.preventDefault();
    //   userInteraction = true;
    //   stopClock();
    // });

    // window.addEventListener('pointerup', (e) => {
    //   e.preventDefault();
    //   userInteraction = false;
    //   startClock();
    // });

    // window.addEventListener('pointercancel', (e) => {
    //   e.preventDefault();
    //   userInteraction = false;
    //   startClock();
    // });

    // window.addEventListener('pointermove', (e) => {
    //   e.preventDefault();
    //   if (userInteraction) {
    //     processInteractionEvent(e);
    //   }
    // });

    screen.orientation.addEventListener('change', resizeClock);
    window.addEventListener('resize', resizeClock);

    function generateBlades(parent, qtyBlades){
      const blades = [];

      if (parent !== null){
        for(let i = 0; i < qtyBlades; i++){
          const div = document.createElement('div');
          div.setAttribute('class','position-absolute top-50 start-50 translate-middle');
          div.setAttribute('draggable', false);
          div.style.setProperty('transform-origin', '0 0');
          div.style.setProperty('rotate', `${ i * (360 / qtyBlades) }deg`);

            const blade = document.createElement('div');
            blade.setAttribute('class','rounded-pill m-0 p-0');
            blades.push(blade)

          div.appendChild(blade);
          parent.appendChild(div);
        }
      }
      return blades;
    }

    function resizeClock(){

      let width = '';
      let height = '';
      let radius = '';

      if (window.innerHeight < window.innerWidth){
        height = `${scale}vh`;
        radius = window.innerHeight / 2;
      } else {
        width = `${scale}vw`;
        radius =  window.innerWidth / 2;
      }

      // set width and height
      center.style.setProperty('height', height, 'important');
      center.style.setProperty('width', width, 'important');

      let hourRadius = radius * 0.01 * scale * Math.pow(1 - heightRatio, 0);
      let minuteRadius = radius * 0.01 * scale * Math.pow(1 - heightRatio, 1);
      let secondRadius = radius * 0.01 * scale * Math.pow(1 - heightRatio, 2);
      let milliRadius = radius * 0.01 * scale * Math.pow(1 - heightRatio, 3);

      scaleBlades(hours, hourRadius, heightRatio, widthRatio, padding * Math.pow(2,0));
      scaleBlades(minutes, minuteRadius, heightRatio, widthRatio, padding * Math.pow(2,1));
      scaleBlades(seconds, secondRadius, heightRatio, widthRatio, padding * Math.pow(2,2));
      scaleBlades(millis, milliRadius, heightRatio, widthRatio, padding * Math.pow(2,1));

    }

    // function processInteractionEvent(e){
    //   let centerX = offsetX + window.innerWidth * 0.5;
    //   let centerY = offsetY + window.innerHeight * 0.5;

    //   let lastX = e.clientX + e.movementX;
    //   let lastY = e.clientY + e.movementY;

    //   let deltaAngle = getAngle(centerX, centerY, lastX, lastY, e.clientX, e.clientY);
    // }

    function runClock() {
      colorBlades(hours,'hours');
      colorBlades(minutes,'minutes');
      colorBlades(seconds,'seconds');
      colorBlades(millis,'millis');
    }

    function startClock() {
      if (timer === -1) {
        timer = setInterval(runClock, 1000 * 1 / frameRate);
      }
    }

    function stopClock() {
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