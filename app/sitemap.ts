import { MetadataRoute } from 'next'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

// Function to get all route paths recursively
function getRoutePaths(dir: string, baseDir: string = ''): string[] {
  const paths: string[] = []
  const items = readdirSync(dir)

  for (const item of items) {
    const fullPath = join(dir, item)
    const relativePath = join(baseDir, item)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      // Skip certain directories
      if (
        item.startsWith('_') ||      // Skip _app, _document, etc
        item.startsWith('.') ||      // Skip .git, .next, etc
        item === 'api' ||            // Skip API routes
        item === 'dashboard'         // Skip dashboard routes
      ) {
        continue
      }

      // Remove route group parentheses from path
      const cleanPath = item.replace(/\(.*?\)/, '')
      
      // Recursively get paths from subdirectories
      paths.push(...getRoutePaths(fullPath, join(baseDir, cleanPath)))
    } else if (
      item === 'page.tsx' ||
      item === 'page.ts' ||
      item === 'page.jsx' ||
      item === 'page.js'
    ) {
      // Convert directory path to URL path
      let urlPath = baseDir.replace(/\\/g, '/')
      if (urlPath === '') {
        paths.push('/')
      } else {
        paths.push('/' + urlPath)
      }
    }
  }

  return paths
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Add console log to verify function is being called
  console.log('Generating sitemap...');
  
  const baseUrl = 'https://www.takeout-threads.com'
  
  // Get all dynamic routes from the app directory
  const appDirectory = join(process.cwd(), 'app')
  const paths = getRoutePaths(appDirectory)

  // Create sitemap entries
  const sitemapEntries = paths.map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/' ? 'daily' : 'weekly' as 'daily' | 'weekly',
    priority: path === '/' ? 1 : 0.8
  }))

  return sitemapEntries
} 