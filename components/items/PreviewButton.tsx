"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { getStore } from "@/lib/supabase/stores"

interface PreviewButtonProps {
  storeId: string
  itemSku: string
}

export function PreviewButton({ storeId, itemSku }: PreviewButtonProps) {
  const [storeDomain, setStoreDomain] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const { data: store, error } = await getStore(storeId)
        if (error) throw error
        setStoreDomain(store?.domain || store?.subdomain || null)
      } catch (error) {
        console.error('Error fetching store:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStore()
  }, [storeId])

  const handlePreview = () => {
    if (!storeDomain) return
    // If it's a full domain (contains dots), use it as is, otherwise append .takeout-threads.app
    const baseUrl = storeDomain.includes('.') 
      ? storeDomain 
      : `${storeDomain}.takeout-threads.app`
    const url = `https://${baseUrl}/products/${itemSku}`
    window.open(url, '_blank')
  }

  return (
    <Button
      variant="outline"
      onClick={handlePreview}
      disabled={isLoading || !storeDomain}
      className="gap-2"
    >
      <Eye className="h-4 w-4" />
      Preview
    </Button>
  )
} 