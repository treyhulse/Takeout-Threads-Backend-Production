"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  FolderPlus, 
  Upload,
  Search,
  Loader2
} from "lucide-react"
import { uploadFile, createFolder } from "@/app/dashboard/files/components/storage"
import { useRouter } from "next/navigation"

export function FileActions({ currentPath = "" }: { currentPath?: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const result = await uploadFile(file, currentPath)
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.refresh()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file. Please try again.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!folderName) return

    try {
      const fullPath = currentPath ? `${currentPath}/${folderName}` : folderName
      await createFolder(fullPath)
      setFolderName("")
      setIsCreatingFolder(false)
      router.refresh()
    } catch (error) {
      console.error("Error creating folder:", error)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <FolderPlus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateFolder} className="space-y-4">
            <Input
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <Button type="submit">Create Folder</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="relative">
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <Button variant="outline" size="icon" disabled={isUploading}>
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
} 