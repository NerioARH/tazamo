import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const rootDir = process.cwd();
const brandDir = path.join(rootDir, 'brand');
const publicDir = path.join(rootDir, 'public');
const publicBrandDir = path.join(publicDir, 'brand');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(publicBrandDir)) {
  fs.mkdirSync(publicBrandDir, { recursive: true });
}

// 1. Copy all brand assets to public/brand
const brandFiles = fs.readdirSync(brandDir);
for (const file of brandFiles) {
  fs.copyFileSync(path.join(brandDir, file), path.join(publicBrandDir, file));
}
console.log(`Copied ${brandFiles.length} files from brand/ to public/brand/`);

// 2. Favicon SVG
const faviconSource = path.join(brandDir, 'tazamo-favicon.svg');
fs.copyFileSync(faviconSource, path.join(publicDir, 'favicon.svg'));

// 3. Generate PNG icons using sharp from tazamo-avatar.svg
const avatarSvg = fs.readFileSync(path.join(brandDir, 'tazamo-avatar.svg'));

async function generateIcons() {
  await sharp(avatarSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(avatarSvg)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  await sharp(avatarSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  console.log('PNG icons (180, 192, 512) generated successfully.');

  // 4. Webmanifest
  const webmanifest = {
    name: 'Tazamo',
    short_name: 'Tazamo',
    description: 'Tu barra de café en casa: guías, recetas y equipo seleccionado.',
    start_url: '/',
    display: 'standalone',
    background_color: '#3A0E22',
    theme_color: '#3A0E22',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };

  fs.writeFileSync(
    path.join(publicDir, 'site.webmanifest'),
    JSON.stringify(webmanifest, null, 2),
    'utf-8'
  );
  console.log('site.webmanifest generated successfully.');
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
