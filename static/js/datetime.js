(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', async () => {

    const date = newDateFromOffset(
      parseInt(localStorage.getItem('timeOffset')) || 0
    )

    var picker = mobiscroll.datepicker('#datetimebk', {
      locale: mobiscroll.localeEn,
      theme: 'ios',
      themeVariant: 'dark',
      defaultSelection: date,
      controls: ['date', 'time'],
      touchUi: true,
      display: 'inline',
      onChange: function (event, inst){
        let timeOffset = event.value.getTime() - new Date().getTime();
        localStorage.setItem('timeOffset', timeOffset);
      }
    });

    swiper.on('realIndexChange', (e) => {
      picker.setOptions({
        defaultSelection: newDateFromOffset(
          parseInt(localStorage.getItem('timeOffset')) || 0
        )
      });
    });

    const signature = document.getElementById('bk-signature');
    const pickerContainer = document.getElementById('datetimebk');
    resize();

    screen.orientation.addEventListener('change', resize);
    window.addEventListener('resize', resize);

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

  }, false);
})();
