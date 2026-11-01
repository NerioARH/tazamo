import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const baseUrl = 'https://tazamo.com';
  const guias = await getCollection('guias');
  const sortedGuias = guias.sort(
    (a, b) => new Date(b.data.fechaPublicacion).getTime() - new Date(a.data.fechaPublicacion).getTime()
  );

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tazamo — Tu barra de café en casa</title>
    <link>${baseUrl}</link>
    <description>Guías, recetas y equipo seleccionado para preparar el mejor café en casa.</description>
    <language>es</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${sortedGuias
      .map(
        (g) => `
    <item>
      <title><![CDATA[${g.data.titulo}]]></title>
      <link>${baseUrl}/guias/${g.id}</link>
      <guid>${baseUrl}/guias/${g.id}</guid>
      <description><![CDATA[${g.data.descripcion}]]></description>
      <pubDate>${new Date(g.data.fechaPublicacion).toUTCString()}</pubDate>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
