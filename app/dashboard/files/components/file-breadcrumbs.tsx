"use client"

import { usePathname } from "next/navigation"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

export function FileBreadcrumbs() {
  const pathname = usePathname()
  
  const getBreadcrumbItems = () => {
    const paths = pathname.split('/').filter(Boolean)
    const items = [{ href: '/dashboard/files', label: 'Files' }]
    
    let currentPath = '/dashboard/files'
    paths.slice(1).forEach(path => {
      currentPath += `/${path}`
      items.push({
        href: currentPath,
        label: path.charAt(0).toUpperCase() + path.slice(1)
      })
    })
    
    return items
  }

  return <Breadcrumbs items={getBreadcrumbItems()} />
} 