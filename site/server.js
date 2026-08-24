import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const NO_CACHE = Object.freeze({
  cacheControl: false,
  maxAge: 0,
  etag: false,
});

// js
app.use('/js', express.static(path.join(__dirname, 'dist/js'), NO_CACHE));

// css
app.use('/css', express.static(path.join(__dirname, 'dist/css'), NO_CACHE));

// images
app.use('/img', express.static(path.join(__dirname, 'asset/img'), NO_CACHE));

// index.html
app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'html/index.html')));

// test
app.get('/test/css', (_, res) => res.sendFile(path.join(__dirname, 'html/test/css.html')));
app.get('/test/canvas', (_, res) => res.sendFile(path.join(__dirname, 'html/test/canvas.html')));
app.get('/test/rating', (_, res) => res.sendFile(path.join(__dirname, 'html/test/rating.html')));

const PORT = process.env.PORT || 1234;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
