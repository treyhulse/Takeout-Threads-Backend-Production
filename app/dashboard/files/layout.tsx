import { Separator } from "@/components/ui/separator"
import { BucketStorage } from "./components/bucket-storage"
import { FileActions } from "./components/file-actions"
import { FileBreadcrumbs } from "./components/file-breadcrumbs"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/CopyButton"
export default async function FilesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { getOrganization } = getKindeServerSession()
  const org = await getOrganization()
  if (!org?.orgCode) throw new Error("No organization found")
  const orgCode = org.orgCode
  const orgName = org.orgName

  return (
    <div className="min-h-screen pb-16 relative">
      <div className="space-y-6 p-6">
        <div className="space-y-0.5">
        <div className="flex-1">
            <h1 className="text-3xl font-bold">{org.orgName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-muted-foreground">
                {org.orgCode}
              </code>
              <CopyButton value={org.orgCode} />
            </div>
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
            <div className="mb-6">
              <FileActions />
            </div>
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
