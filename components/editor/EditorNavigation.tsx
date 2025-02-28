'use client'

import { useStore } from './StoreProvider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Globe,
  LayoutTemplate,
  Palette,
  Settings,
  ChevronLeft,
  Eye,
  Save,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createPage } from '@/lib/supabase/pages'

export function EditorNavigation() {
  const { store, pages, currentPage, setCurrentPage } = useStore()
  const pathname = usePathname()
  const [isCreatingPage, setIsCreatingPage] = useState(false)
  const [newPageName, setNewPageName] = useState('')

  if (!store) return null

  const handleCreatePage = async () => {
    try {
      const { data, error } = await createPage({
        store_id: store.id,
        org_id: store.org_id,
        name: newPageName,
        metadata: { layout: [] }
      })

      if (error) throw new Error(error)

      setNewPageName('')
      setIsCreatingPage(false)
    } catch (error) {
      console.error('Error creating page:', error)
    }
  }

  return (
    <div className="w-64 border-r bg-muted/10">
      {/* Store Info */}
      <div className="p-4 border-b">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/dashboard/stores/${store.id}`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h2 className="font-semibold truncate">{store.name}</h2>
        <p className="text-sm text-muted-foreground truncate">
          {store.slogan}
        </p>
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="p-4 space-y-4">
          {/* Pages */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Pages</h3>
              <Dialog open={isCreatingPage} onOpenChange={setIsCreatingPage}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Create New Page</h2>
                    <div className="space-y-2">
                      <Label htmlFor="pageName">Page Name</Label>
                      <Input
                        id="pageName"
                        value={newPageName}
                        onChange={(e) => setNewPageName(e.target.value)}
                        placeholder="Enter page name"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleCreatePage}>
                        Create Page
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-1">
              {pages.map((page) => (
                <Button
                  key={page.id}
                  variant={currentPage === page.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setCurrentPage(page.id)}
                >
                  <LayoutTemplate className="h-4 w-4 mr-2" />
                  {page.name}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Theme & Settings */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link href={`/dashboard/stores/${store.id}/theme`}>
                <Palette className="h-4 w-4 mr-2" />
                Theme
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link href={`/dashboard/stores/${store.id}/settings`}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link 
                href={`https://${store.subdomain}.takeout-threads.app`}
                target="_blank"
              >
                <Globe className="h-4 w-4 mr-2" />
                View Site
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="default"
              className="w-full justify-start"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
} 