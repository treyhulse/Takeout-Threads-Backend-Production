'use client'

import { notFound } from "next/navigation"
import { getPage } from "@/lib/supabase/pages"
import { Canvas } from "@/components/editor/canvas/Canvas"
import { Toolbar } from "@/components/editor/toolbar/Toolbar"
import useEditorStore from "@/lib/store/editor"
import { useEffect } from "react"

interface EditorPageProps {
  params: {
    storeId: string
    pageId: string
  }
}

export default function EditorPage({ params }: EditorPageProps) {
  const { history, setMode } = useEditorStore()

  useEffect(() => {
    // Initialize editor mode
    setMode('edit')

    // Load page data
    const loadPage = async () => {
      const { data: page, error } = await getPage(params.pageId)

      if (error || !page) {
        notFound()
      }

      // Initialize editor with page layout
      const layout = (page.metadata as { layout: any[] })?.layout || []
      useEditorStore.setState({
        history: {
          past: [],
          present: layout,
          future: []
        }
      })
    }

    loadPage()
  }, [params.pageId, setMode])

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Canvas */}
      <div className="flex-1 overflow-auto p-6">
        <Canvas />
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l bg-muted/10">
        <Toolbar />
      </div>
    </div>
  )
} 