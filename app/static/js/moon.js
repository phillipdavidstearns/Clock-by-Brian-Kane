(function () {
  'use strict';

  const container = document.getElementById('moon');
  const frame = document.getElementById('frame');
  const moon = document.createElement('img');

  const phase_offset = 735000; //seconds to match current moon phase.
  const phase_period = 2551392;
  const EPOCH = 2440587.5;
  let moonInterval = -1;

  function init() {

    //initialize moon image
    moon.setAttribute('id','moon-image');
    moon.setAttribute('class','img-fluid');

    //append moon image to its containing div
    container.appendChild(moon);

    animate();

    if (moonInterval === -1) {
      moonInterval = setInterval(animate, 1000);
    }

  }

  function animate() {
    const phase = Math.round(235 * SunCalc.getMoonIllumination().phase);
    moon.src = `./static/media/moon/moon.${phase.toString().padStart(4,'0')}.jpg`;
  }

  function onWindowLoaded() {
    init();
  }

  /** Window load event kicks off execution */
  window.addEventListener('load', onWindowLoaded, false);

})();
