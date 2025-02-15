import { Separator } from "@/components/ui/separator"
import { BucketStorage } from "./components/bucket-storage"
import { FileBreadcrumbs } from "./components/file-breadcrumbs"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/CopyButton"
import { redirect } from "next/navigation"

export default async function FilesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { getOrganization } = getKindeServerSession()
  const org = await getOrganization()
  
  if (!org?.orgCode) {
    redirect("/dashboard")
  }

  const orgCode = org.orgCode
  const orgName = org.orgName

  return (
    <div className="min-h-screen pb-16 relative">
      <div className="space-y-6 p-6">
        <div className="space-y-0.5">
        <div className="flex-1">
            <h1 className="text-3xl font-bold">File Cabinet</h1>
          </div>
        </div>
        <Separator className="my-6" />
        
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <nav className="flex space-y-2 flex-col">
              <h3 className="font-semibold mb-2">Categories</h3>
              <a href="/dashboard/files" className="text-sm hover:underline">All Files</a>
              <a href="/dashboard/files/brand" className="text-sm hover:underline">Brand Assets</a>
              <a href="/dashboard/files/personal" className="text-sm hover:underline">Personal</a>
            </nav>
            
            <div className="mt-8">
              <h3 className="font-semibold mb-2">Storage</h3>
              <BucketStorage />
            </div>
          </aside>

          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 md:left-[220px] lg:left-[280px] right-0 bg-background border-t py-2.5 px-4 backdrop-blur-sm">
        <FileBreadcrumbs />
      </div>
    </div>
  )
}
