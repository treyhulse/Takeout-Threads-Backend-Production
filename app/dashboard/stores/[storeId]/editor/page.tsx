'use client'

import { useStore } from "@/components/editor/StoreProvider"
import { Canvas } from "@/components/editor/canvas/Canvas"
import { Toolbar } from "@/components/editor/toolbar/Toolbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function EditorPage() {
  const { store, pages, currentPage, currentLayout, savePageLayout, isLoading } = useStore()

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  if (!store || !pages.length) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No store or pages found. Please create a page to start editing.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const currentPageData = pages.find(page => page.id === currentPage)

  const handleSave = async () => {
    if (!currentPage) return

    try {
      await savePageLayout()
      toast.success('Changes saved successfully')
    } catch (error) {
      console.error('Error saving changes:', error)
      toast.error('Failed to save changes')
    }
  }

  return (
    <div className="h-screen flex">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="edit" className="h-full flex flex-col">
          <div className="px-4 border-b flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <Button 
              onClick={handleSave}
              className="my-2"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>

          <TabsContent value="edit" className="flex-1 overflow-hidden">
            <div className="h-full flex">
              {/* Canvas */}
              <div className="flex-1 overflow-auto p-6">
                <Canvas />
              </div>

              {/* Toolbar */}
              <div className="w-80 border-l bg-muted/10">
                <Toolbar />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1">
            <iframe
              src={`https://${store.subdomain}.takeout-threads.app/${currentPageData?.slug || ''}`}
              className="w-full h-full border-0"
            />
          </TabsContent>

          <TabsContent value="code" className="flex-1 p-6">
            <pre className="p-4 rounded-lg bg-muted overflow-auto">
              {JSON.stringify(currentLayout, null, 2)}
            </pre>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 