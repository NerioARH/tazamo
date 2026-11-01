import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const distDir = path.join(process.cwd(), 'dist');
const screenshotsDir = path.join(process.cwd(), 'screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

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
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(distDir, reqPath);
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

const PORT = 4321;
server.listen(PORT, async () => {
  console.log(`Preview server listening on http://localhost:${PORT}`);

  const browserPath = fs.existsSync("C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe")
    ? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
    : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  console.log(`Connecting to browser via puppeteer-core: ${browserPath}`);

  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  const targets = [
    { name: 'home', path: '/' },
    { name: 'metodo-v60', path: '/metodos/v60' },
    { name: 'articulo', path: '/guias/01-cafe-amargo-soluciones' },
    { name: 'equipo', path: '/equipo' },
  ];

  for (const target of targets) {
    const url = `http://localhost:${PORT}${target.path}`;

    // Desktop: 1440x900
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    const desktopFile = path.join(screenshotsDir, `${target.name}-desktop-1440.png`);
    await page.screenshot({ path: desktopFile, fullPage: false });
    console.log(`✓ Captured ${target.name}-desktop-1440.png`);

    // Mobile: 390x844
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await page.goto(url, { waitUntil: 'networkidle0' });
    const mobileFile = path.join(screenshotsDir, `${target.name}-mobile-390.png`);
    await page.screenshot({ path: mobileFile, fullPage: false });
    console.log(`✓ Captured ${target.name}-mobile-390.png`);
  }

  await browser.close();
  server.close();
  console.log('🎉 All 8 screenshots captured successfully!');
  process.exit(0);
});
