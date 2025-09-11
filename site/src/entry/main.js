import app from '../app.js';

(async () => {
  const params = new URL(window.location.href).searchParams;
  const autoplay = params.has('autoplay');

  const results = await app({ autoplay });
  console.log(results);
})();
