import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/profile/', '/api/'],
      },
    ],
    sitemap: 'https://constructionrental.vercel.app/sitemap.xml',
  }
}