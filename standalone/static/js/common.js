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

function getTimeDelta(now, then){
  const timestampNow = now.getTime();
  const timestampThen = then.getTime();
  return timestampThen - timestampNow;
}

function newDateFromOffset(offset){
  const timestampNow = new Date().getTime();
  return new Date(timestampNow + offset);
}

function getDaysInMonth(year, month){

  switch(month){

    case 2: //feb
      return year % 4 == 0 ? 29 : 28;
      break;

    case 1: //jan
    case 3: //mar
    case 5: //may
    case 7: //jul
    case 8: //aug
    case 10: //oct
    case 12: //dec
      return 31;
      break;

    case 4: //apr
    case 6: //jun
    case 9: //sep
    case 11: //nov
      return 30;

    default:
      return null;
      break;
  }
}