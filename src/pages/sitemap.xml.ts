import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { LISTA_METODOS } from '../config';

export const GET: APIRoute = async () => {
  const baseUrl = 'https://tazamo.com';
  const guias = await getCollection('guias');
  const equipo = await getCollection('equipo');
  const categorias = Array.from(new Set(equipo.map((p) => p.data.categoria)));

  const staticPages = [
    '',
    '/metodos',
    '/guias',
    '/equipo',
    '/herramientas',
    '/recetas',
    '/sobre',
    '/como-elegimos',
    '/aviso-de-afiliados',
    '/privacidad',
    '/contacto',
  ];

  const methodPages = LISTA_METODOS.map((m) => `/metodos/${m.id}`);
  const guiasPages = guias.map((g) => `/guias/${g.id}`);
  const catPages = categorias.map((c) => `/equipo/${c}`);

  const allUrls = [...staticPages, ...methodPages, ...guiasPages, ...catPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
