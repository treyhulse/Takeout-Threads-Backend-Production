'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Store, Page } from '@prisma/client'
import { getStore } from '@/lib/supabase/stores'
import { getPages, updatePage } from '@/lib/supabase/pages'
import { toast } from 'sonner'

interface ComponentConfig {
  id: string
  type: string
  props: Record<string, any>
  styles: Record<string, any>
  children?: ComponentConfig[]
}

interface PageMetadata {
  layout: ComponentConfig[]
  settings?: {
    seo?: {
      title?: string
      description?: string
      keywords?: string[]
    }
    theme?: {
      background?: string
      textColor?: string
      spacing?: string
    }
  }
}

interface StoreContextType {
  store: Store | null
  pages: Page[]
  currentPage: string | null
  currentLayout: ComponentConfig[]
  setCurrentPage: (pageId: string) => void
  savePageLayout: () => Promise<void>
  addComponent: (component: ComponentConfig) => void
  updateComponent: (componentId: string, updates: Partial<ComponentConfig>) => void
  removeComponent: (componentId: string) => void
  isLoading: boolean
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({
  children,
  storeId,
}: {
  children: React.ReactNode
  storeId: string
}) {
  const [store, setStore] = useState<Store | null>(null)
  const [pages, setPages] = useState<Page[]>([])
  const [currentPage, setCurrentPage] = useState<string | null>(null)
  const [currentLayout, setCurrentLayout] = useState<ComponentConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load current page layout when page changes
  useEffect(() => {
    if (currentPage) {
      const page = pages.find(p => p.id === currentPage)
      const metadata = (page?.metadata as unknown as PageMetadata) || { layout: [] }
      setCurrentLayout(metadata.layout || [])
      toast.success(`Loaded page: ${page?.name}`)
    }
  }, [currentPage, pages])

  useEffect(() => {
    async function loadStore() {
      setIsLoading(true)
      try {
        const { data: storeData, error: storeError } = await getStore(storeId)
        if (storeError) throw new Error(storeError)
        if (!storeData) throw new Error('Store not found')
        
        setStore(storeData)
        toast.success(`Loaded store: ${storeData.name}`)

        const { data: pagesData, error: pagesError } = await getPages(storeId)
        if (pagesError) throw new Error(pagesError)
        if (!pagesData) throw new Error('No pages found')

        setPages(pagesData)
        if (pagesData.length > 0 && !currentPage) {
          setCurrentPage(pagesData[0].id)
        }
      } catch (error) {
        console.error('Error loading store:', error)
        toast.error('Failed to load store')
      } finally {
        setIsLoading(false)
      }
    }

    loadStore()
  }, [storeId, currentPage])

  const addComponent = (component: ComponentConfig) => {
    setCurrentLayout(prev => [...prev, component])
    toast.success(`Added ${component.type} component`)
  }

  const updateComponent = (componentId: string, updates: Partial<ComponentConfig>) => {
    setCurrentLayout(prev => prev.map(component => 
      component.id === componentId 
        ? { ...component, ...updates }
        : component
    ))
    toast.success('Updated component')
  }

  const removeComponent = (componentId: string) => {
    setCurrentLayout(prev => prev.filter(component => component.id !== componentId))
    toast.success('Removed component')
  }

  const savePageLayout = async () => {
    if (!currentPage) return

    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const page = pages.find(p => p.id === currentPage)
        if (!page) throw new Error('Page not found')

        const metadata: PageMetadata = {
          ...((page.metadata as any) || {}),
          layout: currentLayout
        }

        const { data, error } = await updatePage(currentPage, metadata)
        if (error) throw new Error(error)
        if (!data) throw new Error('Failed to save page layout')

        setPages(pages.map(p => 
          p.id === currentPage ? { ...p, metadata: data.metadata } : p
        ))

        resolve()
      } catch (error) {
        console.error('Error saving page layout:', error)
        reject(error)
      }
    })

    toast.promise(promise, {
      loading: 'Saving changes...',
      success: 'Changes saved successfully',
      error: 'Failed to save changes'
    })

    return promise
  }

  return (
    <StoreContext.Provider
      value={{
        store,
        pages,
        currentPage,
        currentLayout,
        setCurrentPage,
        savePageLayout,
        addComponent,
        updateComponent,
        removeComponent,
        isLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
} 