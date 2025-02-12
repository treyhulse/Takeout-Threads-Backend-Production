import { notFound } from "next/navigation"
import { getPage } from "@/lib/supabase/pages"
import { getComponents } from "@/lib/supabase/components"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { PageEditor } from "./page-editor"
import { CreatePageModal } from "@/components/modals/create-page-modal"
import { CreateComponentModal } from "@/components/modals/create-component-modal"

interface PageEditorProps {
  params: {
    storeId: string
    pageId: string
  }
}

export default async function PageEditorPage({ params }: PageEditorProps) {
  const [pageResult, componentsResult] = await Promise.all([
    getPage(params.pageId),
    getComponents()
  ])

  if (pageResult.error || !pageResult.data) {
    notFound()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href={`/dashboard/stores/${params.storeId}`}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{pageResult.data.name}</h1>
        </div>
        <div className="flex items-center gap-2">
            <CreateComponentModal orgId={pageResult.data.org_id} />
            <CreatePageModal storeId={pageResult.data.store_id} orgId={pageResult.data.org_id} />
        </div>

      </div>

      <PageEditor 
        page={pageResult.data} 
        components={componentsResult.data || []} 
      />
    </div>
  )
} 