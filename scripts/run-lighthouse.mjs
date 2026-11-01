import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

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

const PORT = 4322;
server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Lighthouse test server listening on http://127.0.0.1:${PORT}`);

  const reportPath = path.join(process.cwd(), 'lighthouse-report.json');

  try {
    console.log('Running Lighthouse mobile audit...');
    execFileSync('npx.cmd', [
      'lighthouse',
      `http://127.0.0.1:${PORT}/`,
      '--output=json',
      `--output-path=${reportPath}`,
      '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
      '--form-factor=mobile',
      '--throttling-method=provided',
      '--only-categories=performance,accessibility,best-practices,seo',
    ], { stdio: 'inherit', shell: true });

    if (fs.existsSync(reportPath)) {
      const data = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      const scores = {
        performance: Math.round((data.categories.performance?.score || 0) * 100),
        accessibility: Math.round((data.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((data.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((data.categories.seo?.score || 0) * 100),
      };
      console.log('\n=======================================');
      console.log('📊 RESULTADOS LIGHTHOUSE (MÓVIL):');
      console.log(`⚡ Rendimiento:    ${scores.performance} / 100 (Objetivo: ≥ 90)`);
      console.log(`♿ Accesibilidad:  ${scores.accessibility} / 100 (Objetivo: ≥ 95)`);
      console.log(`🛡️ Buenas prácticas: ${scores.bestPractices} / 100`);
      console.log(`🔍 SEO:            ${scores.seo} / 100 (Objetivo: 100)`);
      console.log('=======================================\n');
    }
  } catch (err) {
    console.error('Error running lighthouse:', err.message);
  } finally {
    server.close();
    process.exit(0);
  }
});
