export function splitMix32(seed) {
  let x = seed >>> 0;
  return () => {
    x += 0x9e3779b9;
    let z = x;
    z = (z ^ (z >>> 16)) >>> 0;
    z = Math.imul(z, 0x85ebca6b) >>> 0;
    z = (z ^ (z >>> 13)) >>> 0;
    z = Math.imul(z, 0xc2b2ae35) >>> 0;
    return (z ^ (z >>> 16)) >>> 0;
  };
}

// rotate left 32-bit
export function rotl(x, k) {
  return ((x << k) | (x >>> (32 - k))) >>> 0;
}

export function randomSeed() {
  return Math.random() * 0x100000000 >>> 0;
}
