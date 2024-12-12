(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', async () => {

    const container = document.getElementById('set-time');

    function buildForm(){
      const date = newDateFromOffset(
        parseInt(localStorage.getItem('timeOffset')) || 0
      )

      const form = document.createElement('form');

      // year
      const yearRow = document.createElement('div');
        yearRow.setAttribute('class','row g-3 align-items-center');
        
        const yearLabelCol = document.createElement('div');
          yearLabelCol.setAttribute('class','col-6');
            const yearLabel = document.createElement('div');
              yearLabel.setAttribute('for','year');
              yearLabel.setAttribute('class','col-form-label text-light');
              yearLabel.textContent = 'Year';
          yearLabelCol.appendChild(yearLabel);
        yearRow.appendChild(yearLabelCol);
        
        const yearInputCol = document.createElement('div');
        yearInputCol.setAttribute('class','col-6');
          const yearInput = document.createElement('input');
            yearInput.type = 'number';
            yearInput.readOnly = false;
            yearInput.setAttribute('id','year');
            yearInput.setAttribute('name','year');
            yearInput.setAttribute('min', '0');
            yearInput.setAttribute('max', '9999');
            yearInput.setAttribute('step', '1');
            yearInput.defaultValue = date.getFullYear();
            yearInput.setAttribute('class','form-control form-control-sm bg-dark text-light border-0 no-swipe border-0 no-swipe');
          yearInputCol.appendChild(yearInput);
        yearRow.appendChild(yearInputCol);

      form.appendChild(yearRow);

      // month
      const monthRow = document.createElement('div');
        monthRow.setAttribute('class','row g-3 align-items-center');
        
        const monthLabelCol = document.createElement('div');
          monthLabelCol.setAttribute('class','col-6');
            const monthLabel = document.createElement('div');
              monthLabel.setAttribute('for','month');
              monthLabel.setAttribute('class','col-form-label text-light');
              monthLabel.textContent = 'Month';
          monthLabelCol.appendChild(monthLabel);
        monthRow.appendChild(monthLabelCol);
        
        const monthInputCol = document.createElement('div');
        monthInputCol.setAttribute('class','col-6');
          const monthInput = document.createElement('input');
            monthInput.type = 'number';
            monthInput.setAttribute('id','month');
            monthInput.setAttribute('name','month');
            monthInput.setAttribute('min', '1');
            monthInput.setAttribute('max', '12');
            monthInput.setAttribute('step', '1');
            monthInput.defaultValue = date.getMonth() + 1;
            monthInput.setAttribute('class','form-control form-control-sm bg-dark text-light border-0 no-swipe');
            monthInput.addEventListener('change', (e) => {
              const yearInput = document.getElementById('year');
              const dayInput = document.getElementById('day');
              const days = getDaysInMonth(
                parseInt(yearInput.value),
                parseInt(e.target.value)
              );
              if (dayInput.value > days){
                dayInput.value = days;
              }
              dayInput.setAttribute('max', `${days}`);
            });
          monthInputCol.appendChild(monthInput);
        monthRow.appendChild(monthInputCol);

      form.appendChild(monthRow);

      // day
      const dayRow = document.createElement('div');
        dayRow.setAttribute('class','row g-3 align-items-center');
        
        const dayLabelCol = document.createElement('div');
          dayLabelCol.setAttribute('class','col-6');
            const dayLabel = document.createElement('div');
              dayLabel.setAttribute('for','day');
              dayLabel.setAttribute('class','col-form-label text-light');
              dayLabel.textContent = 'Day';
          dayLabelCol.appendChild(dayLabel);
        dayRow.appendChild(dayLabelCol);
        
        const dayInputCol = document.createElement('div');
        dayInputCol.setAttribute('class','col-6');
          const dayInput = document.createElement('input');
            dayInput.type = 'number';
            dayInput.setAttribute('id','day');
            dayInput.setAttribute('name','day');
            dayInput.setAttribute('min', '1');
            dayInput.setAttribute('max', `${getDaysInMonth(date)}`);
            dayInput.setAttribute('step', '1');
            dayInput.defaultValue = date.getDate();
            dayInput.setAttribute('class','form-control form-control-sm bg-dark text-light border-0 no-swipe');
          dayInputCol.appendChild(dayInput);
        dayRow.appendChild(dayInputCol);

      form.appendChild(dayRow);

      // hour
      const hourRow = document.createElement('div');
        hourRow.setAttribute('class','row g-3 align-items-center');
        
        const hourLabelCol = document.createElement('div');
          hourLabelCol.setAttribute('class','col-6');
            const hourLabel = document.createElement('div');
              hourLabel.setAttribute('for','hour');
              hourLabel.setAttribute('class','col-form-label text-light');
              hourLabel.textContent = 'Hour';
          hourLabelCol.appendChild(hourLabel);
        hourRow.appendChild(hourLabelCol);
        
        const hourInputCol = document.createElement('div');
        hourInputCol.setAttribute('class','col-6');
          const hourInput = document.createElement('input');
            hourInput.type = 'number';
            hourInput.setAttribute('id','hours');
            hourInput.setAttribute('name','hours');
            hourInput.setAttribute('min', '0');
            hourInput.setAttribute('max', '23');
            hourInput.setAttribute('step', '1');
            hourInput.defaultValue = date.getHours();
            hourInput.setAttribute('class','form-control form-control-sm bg-dark text-light border-0 no-swipe');
          hourInputCol.appendChild(hourInput);
        hourRow.appendChild(hourInputCol);

      form.appendChild(hourRow);

      // min
      const minRow = document.createElement('div');
        minRow.setAttribute('class','row g-3 align-items-center');
        
        const minLabelCol = document.createElement('div');
          minLabelCol.setAttribute('class','col-6');
            const minLabel = document.createElement('div');
              minLabel.setAttribute('for','minutes');
              minLabel.setAttribute('class','col-form-label text-light');
              minLabel.textContent = 'Minutes';
          minLabelCol.appendChild(minLabel);
        minRow.appendChild(minLabelCol);
        
        const minInputCol = document.createElement('div');
        minInputCol.setAttribute('class','col-6');
          const minInput = document.createElement('input');
            minInput.type = 'number';
            minInput.setAttribute('id','minutes');
            minInput.setAttribute('name','minutes');
            minInput.setAttribute('min', '0');
            minInput.setAttribute('max', '59');
            minInput.setAttribute('step', '1');
            minInput.defaultValue = date.getMinutes();
            minInput.setAttribute('class','form-control form-control-sm bg-dark text-light border-0 no-swipe');
          minInputCol.appendChild(minInput);
        minRow.appendChild(minInputCol);

      form.appendChild(minRow);

      // sec
      const secRow = document.createElement('div');
        secRow.setAttribute('class','row g-3 align-items-center');
        
        const secLabelCol = document.createElement('div');
          secLabelCol.setAttribute('class','col-6');
            const secLabel = document.createElement('div');
              secLabel.setAttribute('for','seconds');
              secLabel.setAttribute('class','col-form-label text-light');
              secLabel.textContent = 'Seconds';
          secLabelCol.appendChild(secLabel);
        secRow.appendChild(secLabelCol);
        
        const secInputCol = document.createElement('div');
        secInputCol.setAttribute('class','col-6');
          const secInput = document.createElement('input');
            secInput.type = 'number';
            secInput.setAttribute('id','seconds');
            secInput.setAttribute('name','seconds');
            secInput.setAttribute('sec', '0');
            secInput.setAttribute('max', '59');
            secInput.setAttribute('step', '1');
            secInput.defaultValue = date.getSeconds();
            secInput.setAttribute('class','form-control form-control-sm bg-dark text-light border-0 no-swipe');
          secInputCol.appendChild(secInput);
        secRow.appendChild(secInputCol);

      form.appendChild(secRow);

      const updateRow = document.createElement('div');
        updateRow.setAttribute('class','row g-3 align-items-center justify-content-center mt-1');
        const updateCol = document.createElement('div');
        updateCol.setAttribute('class','col-6');
          const updateButton = document.createElement('button');
            updateButton.setAttribute('class','btn btn-sm bg-dark text-light rounded-pill no-swipe w-100');
            updateButton.textContent = 'Set Time';
            updateButton.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();

              let setDate = dateFromForm();
              let timeOffset = setDate.getTime() - new Date().getTime();

              localStorage.setItem('timeOffset', timeOffset);

            })
          updateCol.appendChild(updateButton)
        updateRow.appendChild(updateCol);
      form.appendChild(updateRow);

      return form;
    }

    function dateFromForm(){
      let year = parseInt(document.getElementById('year').value);
      let month = parseInt(document.getElementById('month').value) - 1;
      let day = parseInt(document.getElementById('day').value);
      let hours = parseInt(document.getElementById('hours').value);
      let minutes = parseInt(document.getElementById('minutes').value);
      let seconds = parseInt(document.getElementById('seconds').value);

      let date = new Date();

      date.setFullYear(year);
      date.setMonth(month);
      date.setDate(day);
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(seconds);

      return date;
    }

    function init(){
      container.appendChild(buildForm());
    }

    init();

  }, false);
})();