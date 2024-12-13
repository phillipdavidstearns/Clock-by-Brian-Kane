(function () {
  'use strict';

  const container = document.getElementById('moon');
  const frame = document.getElementById('frame');
  const moon = document.createElement('img');

  let moonInterval = -1;

  function init() {

    //initialize moon image
    moon.setAttribute('id','moon-image');
    moon.setAttribute('class','min-vh-100');

    //append moon image to its containing div
    container.appendChild(moon);

    resizeMoon(100);
    animate();

    if (moonInterval === -1) {
      moonInterval = setInterval(animate, 1000);
    }

  }

  function resizeMoon(scale){

      let width = '';
      let height = '';

      if (window.innerHeight < window.innerWidth){
        height = `${scale}vh`;
        // height = `${parseFloat(frame.getBoundingClientRect().width) * scale / 100.0}px`;
      } else {
        width = `${scale}vw`;
        // width = `${parseFloat(frame.getBoundingClientRect().height) * scale / 100.0}px`;
      }

      // set width and height
      moon.style.setProperty('height', height, 'important');
      moon.style.setProperty('width', width, 'important');

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
  screen.orientation.addEventListener('change', () => {resizeMoon(100)});
  window.addEventListener('resize', () => {resizeMoon(100)});

})();
