"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { FileGrid } from "../components/file-grid"
import { FolderGrid } from "../components/folder-grid"
import { getFiles, getFileUrl, uploadFile, createFolder } from "@/app/dashboard/files/components/storage"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDropzone } from "react-dropzone"
import { ViewToggle } from "../components/view-toggle"
import { ChevronLeft } from "lucide-react"

interface FileItem {
  name: string
  type: 'folder' | 'file'
  meta: string
  url?: string
}

export default function NestedFolderPage() {
  const params = useParams()
  const router = useRouter()
  // Handle nested paths
  const fullPath = (params.path as string[]).join('/')
  
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<any[]>([])
  const [newFolderName, setNewFolderName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const [view, setView] = useState<"grid" | "list">("grid")

  const loadItems = useCallback(async () => {
    try {
      const { data } = await getFiles(fullPath)
      if (!data) return

      // Separate folders and files
      const folderItems = data
        .filter(item => item.name.endsWith('/') || !item.metadata?.mimetype)
        .map(folder => ({
          name: folder.name,
          meta: 'Folder'
        }))

      const fileItems = await Promise.all(
        data
          .filter(item => !item.name.endsWith('/') && item.metadata?.mimetype)
          .map(async (file) => {
            const { data: urlData } = await getFileUrl(`${fullPath}/${file.name}`)
            return {
              name: file.name,
              type: 'file' as const,
              meta: `${(file.metadata?.size / 1024).toFixed(2)} KB • ${new Date(file.created_at).toLocaleDateString()}`,
              url: urlData.publicUrl
            }
          })
      )

      setFolders(folderItems)
      setFiles(fileItems)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load items"
      })
    }
  }, [toast, fullPath])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      for (const file of acceptedFiles) {
        await uploadFile(file, fullPath)
        toast({
          title: "Success",
          description: "File uploaded successfully"
        })
      }
      loadItems()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file"
      })
    }
  }, [toast, loadItems, fullPath])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const handleCreateFolder = async () => {
    try {
      if (!newFolderName.trim()) return
      await createFolder(`${fullPath}/${newFolderName.trim()}`)
      setNewFolderName("")
      setIsDialogOpen(false)
      loadItems()
      toast({
        title: "Success",
        description: "Folder created successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create folder"
      })
    }
  }

  const handleBack = () => {
    const pathParts = fullPath.split('/')
    pathParts.pop() // Remove the last segment
    const parentPath = pathParts.length > 0 ? `/files/${pathParts.join('/')}` : '/files'
    router.push(parentPath)
  }

  useEffect(() => {
    loadItems()
  }, [loadItems])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="hover:bg-accent"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      <div className="space-y-6">
        <div>
          <FolderGrid folders={folders} view={view} />
        </div>
        <div>
          <FileGrid files={files} view={view} />
        </div>
      </div>

      <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary">
        <input {...getInputProps()} />
        <p>Drag and drop files here, or click to select files</p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create Folder</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <Button onClick={handleCreateFolder}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 