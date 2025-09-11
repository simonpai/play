export function random() {
  return new Random();
}

class Random {

  get state() {
    return undefined;
  }

  next() {
    return Math.floor(Math.random() * 0x100000000);
  }

}
