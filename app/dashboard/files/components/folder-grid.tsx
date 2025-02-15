"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { FolderIcon, ChevronDown, ChevronRight } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

interface FolderItem {
  name: string
  meta: string
}

export function FolderGrid({ folders, view = "grid" }: { folders: FolderItem[], view?: "grid" | "list" }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const handleFolderClick = (folderName: string) => {
    const cleanFolderName = folderName.replace(/\/\.keep$/, '').replace(/\/$/, '')
    const newPath = pathname === '/files' 
      ? `/files/${cleanFolderName}`
      : `${pathname}/${cleanFolderName}`
    router.push(newPath)
  }

  if (folders.length === 0) return null

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        className="mb-2 p-0 h-auto hover:bg-transparent"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <h2 className="text-xl font-semibold">Folders</h2>
        </div>
      </Button>

      {isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {folders.map((folder, index) => (
            <Card 
              key={index} 
              className="p-3 hover:bg-accent cursor-pointer"
              onClick={() => handleFolderClick(folder.name)}
            >
              <div className="flex items-center space-x-2">
                <FolderIcon className="h-4 w-4 text-yellow-500" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">{folder.name}</h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 