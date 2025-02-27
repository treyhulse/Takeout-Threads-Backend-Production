import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Add console log to verify function is being called
  console.log('Generating sitemap...');
  
  const baseUrl = 'https://www.takeout-threads.com'
  
  // Add your static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products/catalog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solutions/custom-brands`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ] as MetadataRoute.Sitemap

  return staticRoutes
} 