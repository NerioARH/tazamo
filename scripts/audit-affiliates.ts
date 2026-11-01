import fs from 'node:fs';
import path from 'node:path';

let hasErrors = false;

function error(file: string, msg: string) {
  console.error(`❌ [AUDIT FAILED] ${file}: ${msg}`);
  hasErrors = true;
}

function success(msg: string) {
  console.log(`✅ ${msg}`);
}

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');

function getAllFiles(dir: string, extList: string[] = ['.astro', '.md', '.mdx', '.ts', '.tsx']): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.astro' && file !== 'dist') {
        results = results.concat(getAllFiles(fullPath, extList));
      }
    } else {
      if (extList.some(ext => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

console.log('🔍 Iniciando auditoría de cumplimiento de Amazon Asociados...\n');

// 1. Audit Content Collection: Equipo
const equipoDir = path.join(srcDir, 'content', 'equipo');
if (fs.existsSync(equipoDir)) {
  const productFiles = fs.readdirSync(equipoDir).filter(f => f.endsWith('.json') || f.endsWith('.md') || f.endsWith('.mdx'));
  for (const file of productFiles) {
    const fullPath = path.join(equipoDir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');

    // Rule: Check if "probado" claim matches probado: true
    if (content.toLowerCase().includes('probado por nosotros')) {
      if (!content.includes('"probado": true') && !content.includes('probado: true')) {
        error(file, 'Afirma "Probado por nosotros" pero probado no es true.');
      }
    }

    // Rule: Check for hardcoded prices in product files ($XX or XX€ or XX €)
    const priceRegex = /(?:\$|\€|\bEUR\b|\bUSD\b)\s*\d+(?:[\.,]\d{2})?|\d+(?:[\.,]\d{2})?\s*(?:\€|\$)/g;
    const matches = content.match(priceRegex);
    if (matches) {
      error(file, `Contiene precios fijos no autorizados por la política de afiliados: ${matches.join(', ')}`);
    }
  }
  success(`Verificados ${productFiles.length} productos en src/content/equipo/`);
}

// 2. Audit all source files for Amazon links
const allFiles = getAllFiles(srcDir);
let linksAudited = 0;

for (const filePath of allFiles) {
  const relPath = path.relative(rootDir, filePath);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Find occurrences of amazon.com or amazon.es links
  if (relPath.includes('config.ts')) {
    continue;
  }
  const amazonUrlMatches = content.matchAll(/https?:\/\/(?:www\.)?amazon\.(?:com|es)[^\s"'`\)]+/g);
  for (const match of amazonUrlMatches) {
    const url = match[0];
    linksAudited++;

    // Must have tag parameter
    if (!url.includes('tag=')) {
      error(relPath, `Enlace de Amazon sin parámetro tag: ${url}`);
    }
  }

  // If file creates an anchor tag targeting Amazon, check rel="sponsored nofollow noopener"
  if (content.includes('href={') && content.includes('amazon') || content.includes('href="https://www.amazon')) {
    // Check rel attribute
    const hasSponsored = content.includes('sponsored');
    const hasNofollow = content.includes('nofollow');
    const hasNoopener = content.includes('noopener');
    if (!hasSponsored || !hasNofollow || !hasNoopener) {
      // If it's a component rendering amazon links, it must include rel="sponsored nofollow noopener"
      if (!relPath.endsWith('config.ts')) {
        error(relPath, 'Enlace a Amazon no especifica rel="sponsored nofollow noopener" completo.');
      }
    }
  }
}

success(`Auditoría de enlaces de Amazon completada (${linksAudited} enlaces comprobados).`);

if (hasErrors) {
  console.error('\n❌ La auditoría de afiliados encontró infracciones que deben corregirse.');
  process.exit(1);
} else {
  console.log('\n🎉 Todos los enlaces y especificaciones cumplen con las directivas de Amazon Asociados.');
  process.exit(0);
}
