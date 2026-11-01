import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const distDir = path.join(process.cwd(), 'dist');
const screenshotsDir = path.join(process.cwd(), 'screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Basic static file server for dist
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  
  let filePath = path.join(distDir, reqPath);
  
  // If directory, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // Fallback 404
    const notFoundPath = path.join(distDir, '404.html');
    if (fs.existsSync(notFoundPath)) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      fs.createReadStream(notFoundPath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  }
});

const PORT = 4329;
server.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);

  const chromePath = fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

  console.log(`Using browser: ${chromePath}`);

  const pages = [
    { name: 'home', url: `http://localhost:${PORT}/` },
    { name: 'hub-metodo-v60', url: `http://localhost:${PORT}/metodos/v60` },
    { name: 'articulo-cafe-amargo', url: `http://localhost:${PORT}/guias/01-cafe-amargo-soluciones` },
    { name: 'la-barra-equipo', url: `http://localhost:${PORT}/equipo` },
  ];

  const viewports = [
    { label: 'desktop-1440', width: 1440, height: 900 },
    { label: 'mobile-390', width: 390, height: 844 },
  ];

  for (const page of pages) {
    for (const vp of viewports) {
      const outName = `${page.name}-${vp.label}.png`;
      const outPath = path.join(screenshotsDir, outName);
      console.log(`Capturing ${outName}...`);

      try {
        execFileSync(chromePath, [
          '--headless=new',
          '--no-sandbox',
          '--disable-gpu',
          '--disable-extensions',
          '--hide-scrollbars',
          `--window-size=${vp.width},${vp.height}`,
          `--screenshot=${outPath}`,
          page.url,
        ], { timeout: 15000 });
        console.log(`✓ Saved ${outName}`);
      } catch (err) {
        console.error(`Error capturing ${outName}:`, err.message);
      }
    }
  }

  console.log('All screenshots completed.');
  server.close();
  process.exit(0);
});
