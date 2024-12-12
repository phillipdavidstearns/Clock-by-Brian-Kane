// https://www.cssscript.com/ios-os-x-style-pure-css-loading-spinner/#google_vignette

(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', async () => {

    // fetch query parameters
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    // set global variables

    let padding = Math.min(0.1, Math.max(0.0, parseFloat(params.padding))) || 0.0175;
    let heightRatio = Math.min(0.99, Math.max(0.01, parseFloat(params.heightRatio))) || 0.625;
    let widthRatio = Math.min(1.0, Math.max(0.0, parseFloat(params.widthRatio))) || 0.3125;
    let scale = Math.min(150, Math.max(10, parseFloat(params.scale))) || 95;
    let bladeQty = Math.min(16, Math.max(8, parseInt(params.blades))) || 12;

    let clockInterval = -1;

    let hourOffset = 0.0;
    let minuteOffset = 0.0;
    let secondOffset = 0.0;

    // global elements
    const clock = document.getElementById("clock");

    const hours = generateBlades(clock, bladeQty);
    const minutes = generateBlades(clock, bladeQty);
    const seconds = generateBlades(clock, bladeQty);
    const millis = generateBlades(clock, bladeQty);

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
      let now = newDateFromOffset(
        parseInt(localStorage.getItem('timeOffset')) || 0
      );
      let value = null;
      let div = null;

      switch(unit){
        case 'hours':
          value = ((now.getHours() + ((now.getMinutes() + (now.getSeconds() + now.getMilliseconds() * 0.001) / 60) / 60)) % bladeQty) / bladeQty;
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
      clock.style.setProperty('height', height, 'important');
      clock.style.setProperty('width', width, 'important');

      let hourRadius = radius * 0.01 * scale * Math.pow(1 - heightRatio, 0);
      let minuteRadius = radius * 0.01 * scale * Math.pow(1 - heightRatio, 1);
      let secondRadius = radius * 0.01 * scale * Math.pow(1 - heightRatio, 2);
      let milliRadius = radius * 0.01 * scale * Math.pow(1 - heightRatio, 3);

      scaleBlades(hours, hourRadius, heightRatio, widthRatio, padding * Math.pow(2,0));
      scaleBlades(minutes, minuteRadius, heightRatio, widthRatio, padding * Math.pow(2,1));
      scaleBlades(seconds, secondRadius, heightRatio, widthRatio, padding * Math.pow(2,2));
      scaleBlades(millis, milliRadius, heightRatio, widthRatio, padding * Math.pow(2,1));

    }

    function runClock() {
      colorBlades(hours,'hours');
      colorBlades(minutes,'minutes');
      colorBlades(seconds,'seconds');
      colorBlades(millis,'millis');
    }

    function startClock() {
      if (clockInterval === -1) {
        clockInterval = setInterval(runClock, 1000 / bladeQty);
      }
    }

    function stopClock() {
      if (clockInterval !== -1) {
        clearInterval(clockInterval);
        clockInterval = -1;
      }
    }

  }, false);
})();
