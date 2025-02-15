"use client"

import { useEffect, useState, useCallback } from "react"
import { FolderGrid } from "@/app/dashboard/files/components/folder-grid"
import { getFiles, getFileUrl, uploadFile, createFolder } from "@/app/dashboard/files/components/storage"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDropzone } from "react-dropzone"
import { ViewToggle } from "@/app/dashboard/files/components/view-toggle"
import { FileGrid } from "@/app/dashboard/files/components/file-grid"
import { FileActions } from "@/app/dashboard/files/components/file-actions"
import { Loader2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface FileItem {
  name: string
  type: 'folder' | 'file'
  meta: string
  url?: string
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<any[]>([])
  const [newFolderName, setNewFolderName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const [view, setView] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useLocalStorage("filesCurrentPage", 1)
  const [itemsPerPage, setItemsPerPage] = useLocalStorage("filesPerPage", 25)

  const loadItems = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await getFiles('', currentPage, itemsPerPage)
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
            const { data: urlData } = await getFileUrl(file.name)
            return {
              name: file.name,
              type: file.metadata?.mimetype?.includes('folder') ? 'folder' : 'file' as const,
              meta: `${(file.metadata?.size / 1024).toFixed(2)} KB • ${new Date(file.created_at).toLocaleDateString()}`,
              url: urlData?.publicUrl
            }
          })
      )

      setFolders(folderItems)
      setFiles(fileItems as FileItem[])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load items"
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, currentPage, itemsPerPage])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      for (const file of acceptedFiles) {
        await uploadFile(file)
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
  }, [toast, loadItems])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const handleCreateFolder = async () => {
    try {
      if (!newFolderName.trim()) return
      await createFolder(newFolderName.trim())
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

  useEffect(() => {
    loadItems()
  }, [loadItems])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <FileActions currentPath="" />
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-2 min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading files and folders...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <FolderGrid folders={folders} view={view} isLoading={isLoading} />
          </div>
          <div>
            <FileGrid 
              files={files} 
              view={view} 
              isLoading={isLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              onPageChange={loadItems}
            />
          </div>
        </div>
      )}

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