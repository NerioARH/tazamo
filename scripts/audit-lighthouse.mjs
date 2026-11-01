import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import lighthouse from 'lighthouse';

const distDir = path.join(process.cwd(), 'dist');

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
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 4330;
server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);

  const browserPath = fs.existsSync("C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe")
    ? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
    : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--remote-debugging-port=9222'],
  });

  const url = `http://127.0.0.1:${PORT}/`;
  console.log(`Auditing ${url} with Lighthouse...`);

  try {
    const options = {
      port: 9222,
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        disabled: false,
      },
      throttlingMethod: 'provided',
    };

    const runnerResult = await lighthouse(url, options);
    const categories = runnerResult.lhr.categories;

    const scores = {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
    };

    console.log('\n=======================================');
    console.log('📊 RESULTADOS LIGHTHOUSE (MÓVIL):');
    console.log(`⚡ Rendimiento:     ${scores.performance} / 100 (Objetivo: ≥ 90)`);
    console.log(`♿ Accesibilidad:   ${scores.accessibility} / 100 (Objetivo: ≥ 95)`);
    console.log(`🛡️ Buenas prácticas: ${scores.bestPractices} / 100`);
    console.log(`🔍 SEO:             ${scores.seo} / 100 (Objetivo: 100)`);
    console.log('=======================================\n');

    fs.writeFileSync(
      path.join(process.cwd(), 'lighthouse-report.json'),
      JSON.stringify(runnerResult.lhr, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.error('Error during Lighthouse run:', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});
