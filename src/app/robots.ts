import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/relatorios_infinity/',
          '/teste-whatsapp/',
          '/instagram-carousel/',
        ],
      },
    ],
    sitemap: 'https://infinityondemand.com.br/sitemap.xml',
  };
}
