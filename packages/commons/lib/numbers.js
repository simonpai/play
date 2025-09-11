export function uInt32ToUnitDouble(value) {
    return value / 0x100000000;
}

export function unitDoubleToInt(value, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  return Math.floor(value * (max - min + 1) + min);
}

export function uInt32ToInt(value, min, max) {
  return value % (max - min + 1) + min;
}
