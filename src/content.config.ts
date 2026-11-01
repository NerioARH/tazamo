import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const equipo = defineCollection({
  loader: glob({ pattern: '**/*.{json,md,mdx}', base: './src/content/equipo' }),
  schema: z.object({
    id: z.string(),
    nombre: z.string(),
    marca: z.string(),
    categoria: z.string(), // molinillos-manuales, basculas, hervidores, cafeteras, espumadores
    categoriaLabel: z.string().optional(),
    metodos: z.array(z.string()),
    nivel: z.enum(['principiante', 'intermedio', 'pro']),
    tueste: z.enum(['crudo', 'claro', 'medio', 'oscuro', 'espresso']),
    idealPara: z.string(),
    razones: z.array(z.string()).length(3),
    contras: z.array(z.string()).min(1).max(2),
    perfil: z.object({
      consumo: z.string(), // '1-2', '3-4', '5+'
      leche: z.enum(['si', 'no', 'ambas']),
      tiempo: z.enum(['rapido', 'medio', 'ritual']),
      presupuesto: z.enum(['bajo', 'medio', 'alto']),
    }),
    asin: z.object({
      us: z.string().optional(),
      es: z.string().optional(),
    }),
    probado: z.boolean().default(false),
    fechaRevision: z.string(),
    imagen: z.object({
      src: z.string(),
      alt: z.string(),
      fuente: z.enum(['sitestripe', 'api', 'propia', 'ilustracion']),
    }),
    orden: z.number().default(0),
  }),
});

const guias = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guias' }),
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    palabraClave: z.string(),
    intencion: z.string(),
    metodo: z.string(),
    nivel: z.enum(['principiante', 'intermedio', 'pro']),
    tiempoLectura: z.string(),
    fechaPublicacion: z.string(),
    fechaActualizacion: z.string(),
    autor: z.string().default('Equipo Tazamo'),
    borrador: z.boolean().default(true),
    respuestaRapida: z.string(),
    comoLoSabemos: z.string(),
    equipoIds: z.array(z.string()).default([]),
    faq: z.array(
      z.object({
        pregunta: z.string(),
        respuesta: z.string(),
      })
    ).min(3).max(5),
  }),
});

export const collections = { equipo, guias };
