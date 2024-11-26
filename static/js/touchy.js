// Handling Pointer Events
// https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events

// Handling Touch Events
// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events


(() => {
  'use strict';

  const id = -1;
  const ongoingTouches = [];

  function display_message(message){
    const containerOne = document.getElementById('container-1');
    var messageDiv = document.createElement('div');
      messageDiv.setAttribute('class', 'm-1 px-2 rounded-pill bg-dark text-light text-center')
      messageDiv.textContent = message;
      containerOne.appendChild(messageDiv);
      setTimeout(() => {
        containerOne.removeChild(messageDiv);
      }, 5000);
  }

  function process_id(event) {
    // Process this event based on the event's identifier
    display_message(`process_id: ${event}`);
  }

  function process_mouse(event) {
    // Process the mouse pointer event
    display_message(`process_mouse: ${event}`);
  }

  function process_pen(event) {
    // Process the pen pointer event
    display_message(`process_pen: ${event}`);
  }

  function process_touch(event) {
    // Process the touch pointer event
    display_message(`process_touch: ${event}`);
  }

  function process_tilt(tiltX, tiltY) {
    // Tilt data handler
    display_message(`process_tilt: ${event}`);
  }

  function process_pressure(pressure) {
    // Pressure handler
    display_message(`process_pressure: ${pressure}`);
  }

  function process_non_primary(event) {
    // Non primary handler
    display_message(`process_non_primary: ${event}`);
  }

  function down_handler(ev) {

    console.log('event',ev);

    // Calculate the touch point's contact area
    const area = ev.width * ev.height;
    display_message(`area: ${area}`);

    // Compare cached id with this event's id and process accordingly
    if (id === ev.identifier) process_id(ev);

    // Call the appropriate pointer type handler
    switch (ev.pointerType) {
      case "mouse":
        process_mouse(ev);
        break;
      case "pen":
        process_pen(ev);
        break;
      case "touch":
        process_touch(ev);
        break;
      default:
        console.log(`pointerType ${ev.pointerType} is not supported`);
    }

    // Call the tilt handler
    if (ev.tiltX !== 0 && ev.tiltY !== 0) process_tilt(ev.tiltX, ev.tiltY);

    // Call the pressure handler
    process_pressure(ev.pressure);

    // If this event is not primary, call the non primary handler
    if (!ev.isPrimary) process_non_primary(ev);
  }

  function over_handler(event) {display_message(`over`)}
  function enter_handler(event) {display_message(`enter`)}
  function move_handler(event) {display_message(`move`)}
  function up_handler(event) {display_message(`up`)}
  function cancel_handler(event) {display_message(`cancel`)}
  function out_handler(event) {display_message(`out`)}
  function leave_handler(event) {display_message(`leave`)}
  function rawUpdate_handler(event) {display_message(`rawUpdate`)}
  function gotCapture_handler(event) {display_message(`gotCapture`)}
  function lostCapture_handler(event) {display_message(`lostCapture`)}

  function copyTouch({ identifier, pageX, pageY }) {
    return { identifier, pageX, pageY };
  }

  function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
      const id = ongoingTouches[i].identifier;

      if (id === idToFind) {
        return i;
      }
    }
    return -1; // not found
  }

  function handleStart(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      display_message(`touchstart: ${i}`);
      ongoingTouches.push(copyTouch(touches[i]));
    }
  }

  function handleMove(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      const color = colorForTouch(touches[i]);
      const idx = ongoingTouchIndexById(touches[i].identifier);
      if (idx >= 0) {
        display_message(`continuing touch ${idx}`);
        ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
      }
    }
  }

  function handleEnd(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      let idx = ongoingTouchIndexById(touches[i].identifier);
      display_message(`touchend ${idx}`);
      if (idx >= 0) {
        ongoingTouches.splice(idx, 1); // remove it; we're done
      } 
    }
  }

  function handleCancel(evt) {
    evt.preventDefault();
    display_message("touchcancel");
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      let idx = ongoingTouchIndexById(touches[i].identifier);
      ongoingTouches.splice(idx, 1); // remove it; we're done
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {

    const el = document.getElementById('target');
    // Register pointerdown handler
    el.onpointerdown = down_handler;
    // el.onpointerover = over_handler;
    // el.onpointerenter = enter_handler;
    // el.onpointermove = move_handler;
    // el.onpointerup = up_handler;
    // el.onpointercancel = cancel_handler;
    // el.onpointerout = out_handler;
    // el.onpointerleave = leave_handler;
    // el.onpointerrawupdate = rawUpdate_handler;
    // el.ongotpointercapture = gotCapture_handler;
    // el.onlostpointercapture = lostCapture_handler;

    el.addEventListener("touchstart", handleStart);
    el.addEventListener("touchend", handleEnd);
    el.addEventListener("touchcancel", handleCancel);
    el.addEventListener("touchmove", handleMove);

  }, false);
})();
