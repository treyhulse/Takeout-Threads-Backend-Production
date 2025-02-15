"use client"

import { useState, useEffect } from "react"
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
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { deleteFile, renameFile } from "@/app/dashboard/files/components/storage"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocalStorage } from "@/hooks/use-local-storage"

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
      return <FileSpreadsheetIcon className="h-4 w-4 text-green-500" />
    case 'pdf':
      return <FileIcon className="h-4 w-4 text-red-500" />
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    case 'txt':
      return <FileTextIcon className="h-4 w-4 text-gray-500" />
    default:
      return <FileIcon className="h-4 w-4 text-muted-foreground" />
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

interface FileGridProps {
  files: FileItem[]
  view?: "grid" | "list"
  isLoading?: boolean
  currentPage: number
  setCurrentPage: (page: number) => void
  itemsPerPage: number
  setItemsPerPage: (limit: number) => void
  onPageChange: () => void
}

export function FileGrid({ 
  files, 
  view = "grid", 
  isLoading = false,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  onPageChange
}: FileGridProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [newFileName, setNewFileName] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setItemsPerPage(newSize)
    setCurrentPage(1) // Reset to first page
    onPageChange() // Reload data with new limit
  }

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

  const PaginationControls = () => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">Files</h2>
      <div className="flex items-center space-x-4">
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => handlePageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select limit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="75">75 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentPage(currentPage - 1)
              onPageChange()
            }}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.ceil(files.length / itemsPerPage)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentPage(currentPage + 1)
              onPageChange()
            }}
            disabled={currentPage === Math.ceil(files.length / itemsPerPage)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  if (view === "list") {
    return (
      <div className="space-y-2">
        <PaginationControls />
        
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[40px] w-full" />
          ))
        ) : files.length === 0 ? (
          <div className="flex items-center justify-center h-24 border rounded-lg border-dashed">
            <p className="text-sm text-muted-foreground">No files in this folder</p>
          </div>
        ) : (
          <>
            <div className="space-y-[1px]">
              {files.map((file, index) => (
                <Card key={index} className="py-[1px] px-2 hover:bg-accent">
                  <div className="flex items-center">
                    <div className="flex items-center space-x-2 w-[40%]">
                      {getFileIcon(file.name)}
                      <span className="text-xs truncate">{file.name}</span>
                    </div>
                    <div className="w-[30%] text-xs text-muted-foreground">
                      {file.meta}
                    </div>
                    <div className="w-[25%] text-xs text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </div>
                    <div className="flex-shrink-0 ml-auto">
                      <FileActions file={file} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <PaginationControls />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[200px] w-full" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="flex items-center justify-center h-24 border rounded-lg border-dashed">
          <p className="text-sm text-muted-foreground">No files in this folder</p>
        </div>
      ) : (
        <>
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
          </div>
        </>
      )}

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