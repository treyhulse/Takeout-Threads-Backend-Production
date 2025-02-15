"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  FileTextIcon, 
  ImageIcon, 
  FileIcon,
  FileSpreadsheetIcon,
  MoreVertical,
  Pencil,
  Trash2
} from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { deleteFile, renameFile } from "@/app/dashboard/files/components/storage"
import { useRouter } from "next/navigation"

interface FileItem {
  name: string
  meta: string
  url?: string
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'csv':
    case 'xlsx':
    case 'xls':
      return <FileSpreadsheetIcon className="h-10 w-10 text-green-500" />
    case 'pdf':
      return <FileIcon className="h-10 w-10 text-red-500" />
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return <ImageIcon className="h-10 w-10 text-blue-500" />
    case 'txt':
      return <FileTextIcon className="h-10 w-10 text-gray-500" />
    default:
      return <FileIcon className="h-10 w-10 text-muted-foreground" />
  }
}

const isImageFile = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  return ['png', 'jpg', 'jpeg', 'gif'].includes(extension || '')
}

const getThumbnailUrl = (url: string, fileName: string) => {
  if (!isImageFile(fileName)) return null
  return url // Return the URL directly since it's already a public URL
}

export function FileGrid({ files, view = "grid" }: { files: FileItem[], view?: "grid" | "list" }) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [newFileName, setNewFileName] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async (file: FileItem) => {
    try {
      await deleteFile(file.name)
      toast({
        title: "Success",
        description: `File "${file.name}" deleted successfully`
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file"
      })
    }
  }

  const handleRename = async () => {
    if (!selectedFile || !newFileName) return

    try {
      const result = await renameFile(selectedFile.name, newFileName)
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message
        })
        setIsRenaming(false)
        setSelectedFile(null)
        setNewFileName("")
        router.refresh()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to rename file"
      })
    }
  }

  const FileActions = ({ file }: { file: FileItem }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => {
          setSelectedFile(file)
          setNewFileName(file.name)
          setIsRenaming(true)
        }}>
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-destructive"
          onClick={() => handleDelete(file)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  if (view === "list") {
    return (
      <div className="space-y-2">
        {files.map((file, index) => (
          <Card key={index} className="p-4 hover:bg-accent">
            <div className="flex items-center space-x-4">
              {isImageFile(file.name) && file.url ? (
                <div className="relative w-10 h-10">
                  <Image
                    src={getThumbnailUrl(file.url, file.name) || file.url}
                    alt={file.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ) : (
                getFileIcon(file.name)
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{file.name}</h3>
                <p className="text-sm text-muted-foreground">{file.meta}</p>
              </div>
              <FileActions file={file} />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file, index) => (
        <Card key={index} className="p-4 hover:bg-accent">
          <div className="flex justify-end mb-2">
            <FileActions file={file} />
          </div>
          <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2 relative overflow-hidden">
            {isImageFile(file.name) && file.url ? (
              <Image
                src={getThumbnailUrl(file.url, file.name) || file.url}
                alt={file.name}
                fill
                className="object-cover"
              />
            ) : (
              getFileIcon(file.name)
            )}
          </div>
          <h3 className="font-medium truncate">{file.name}</h3>
          <p className="text-sm text-muted-foreground">{file.meta}</p>
        </Card>
      ))}

      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="New file name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />
            <Button onClick={handleRename}>Rename</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 