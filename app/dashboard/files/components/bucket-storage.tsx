"use client"

import { useEffect, useState, useCallback } from "react"
import { getFiles } from "@/app/dashboard/files/components/storage"
import { useToast } from "@/hooks/use-toast"

export function BucketStorage() {
  const [usedSpace, setUsedSpace] = useState(0)
  const maxSpace = 1 * 1024 * 1024 * 1024 // 1GB in bytes
  const { toast } = useToast()

  const calculateStorage = useCallback(async () => {
    try {
      const { data } = await getFiles()
      if (!data) return

      const totalBytes = data.reduce((acc, file) => acc + (file.metadata?.size || 0), 0)
      setUsedSpace(totalBytes)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to calculate storage"
      })
    }
  }, [toast])

  useEffect(() => {
    calculateStorage()
  }, [calculateStorage])

  const usedGB = (usedSpace / (1024 * 1024 * 1024)).toFixed(2)
  const percentUsed = Math.min(100, (usedSpace / maxSpace) * 100).toFixed(0)

  return (
    <div className="text-sm text-muted-foreground">
      <div className="flex justify-between">
        <span>Used Space</span>
        <span>{percentUsed}%</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full mt-2">
        <div 
          className="h-full bg-primary rounded-full" 
          style={{ width: `${percentUsed}%` }}
        />
      </div>
      <p className="mt-2 text-xs">{usedGB}GB of 1GB used</p>
    </div>
  )
} 