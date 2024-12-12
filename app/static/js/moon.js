(function () {
  'use strict';

  const container = document.getElementById('moon');
  const frame = document.getElementById('frame');
  const moon = document.createElement('img');

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
    // https://github.com/mourner/suncalc
    // moon images count from 0001 through 0236
    const phase = 1 + Math.round(235 * SunCalc.getMoonIllumination(
      newDateFromOffset(
        parseInt(localStorage.getItem('timeOffset')) || 0
      )
    ).phase);
    moon.src = `./static/media/moon/moon.${phase.toString().padStart(4,'0')}.jpg`;
  }

  function onWindowLoaded() {
    init();
  }

  /** Window load event kicks off execution */
  window.addEventListener('load', onWindowLoaded, false);

})();
