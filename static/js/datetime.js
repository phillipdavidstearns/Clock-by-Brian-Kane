let picker = undefined;

(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', async () => {

    const date = newDateFromOffset(
      parseInt(localStorage.getItem('timeOffset')) || 0
    )

    let clockInterval = -1;

    picker = mobiscroll.datepicker('#datetimebk', {
      locale: mobiscroll.localeEn,
      theme: 'ios',
      themeVariant: 'dark',
      defaultSelection: date,
      controls: ['date', 'time'],
      touchUi: true,
      display: 'inline',
      onChange: function (event, inst){
        console.log('change');
        let timeOffset = event.value.getTime() - new Date().getTime();
        localStorage.setItem('timeOffset', timeOffset);
      }
    });

    function updatePicker() {
      picker.setTempVal(newDateFromOffset(
        parseInt(localStorage.getItem('timeOffset')) || 0
      ));
    }

    function resize(){

      let width = '';
      let height = '';

      if (window.innerHeight < window.innerWidth){
        height = `${window.innerHeight * 0.25}px`;
      } else {
        width = `${window.innerWidth * 0.25}px`;
      }

      // set width and height
      signature.style.setProperty('height', height, 'important');
      signature.style.setProperty('width', width, 'important');

      pickerContainer.style.setProperty('height', `${window.innerHeight * 1.05}px`, 'important');

    }

    const signature = document.getElementById('bk-signature');
    const pickerContainer = document.getElementById('datetimebk');
    screen.orientation.addEventListener('change', resize);
    window.addEventListener('resize', resize);
    clockInterval = setInterval(updatePicker, 1000);
    resize();

  }, false);
})();
