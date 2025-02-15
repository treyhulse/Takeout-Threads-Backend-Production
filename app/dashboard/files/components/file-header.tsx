"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Upload, FolderPlus, Video } from "lucide-react"

export function FileHeader() {
  return (
    <div className="flex flex-col space-y-4 pb-6">
      <div className="flex items-center space-x-2">
        <Input 
          placeholder="Search files..." 
          className="max-w-sm"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="default">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create
        </Button>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
        <Button variant="outline">
          <FolderPlus className="mr-2 h-4 w-4" />
          Create folder
        </Button>
        <Button variant="outline">
          <Video className="mr-2 h-4 w-4" />
          Record
        </Button>
      </div>

      <div className="flex border-b">
        <Button variant="ghost" className="px-4">Recent</Button>
        <Button variant="ghost" className="px-4">Starred</Button>
        <Button variant="ghost" className="px-4">Shared</Button>
      </div>
    </div>
  )
} 