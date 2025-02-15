"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getStores } from "@/lib/supabase/stores"
import { Store } from "@/types/stores"
import { Skeleton } from "@/components/ui/skeleton"

interface PreviewButtonProps {
  itemSku: string
  itemName: string
}

export function PreviewButton({ itemSku, itemName }: PreviewButtonProps) {
  const [open, setOpen] = useState(false)
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    const fetchStores = async () => {
      setIsLoading(true)
      try {
        const result = await getStores()
        setStores(result.data || [])
      } catch (error) {
        console.error('Failed to fetch stores:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStores()
  }, [open])

  const getPreviewUrl = (store: Store) => {
    const formattedName = itemName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    
    return `https://${store.subdomain}.takeout-threads.app/products/${formattedName}`
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {isLoading ? (
          <div className="p-2">
            <Skeleton className="h-[20px] w-full mb-2" />
            <Skeleton className="h-[20px] w-full mb-2" />
            <Skeleton className="h-[20px] w-full" />
          </div>
        ) : stores.length === 0 ? (
          <div className="p-2 text-sm text-muted-foreground">
            No stores found
          </div>
        ) : (
          stores.map((store) => (
            <DropdownMenuItem key={store.id} asChild>
              <a
                href={getPreviewUrl(store)}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                {store.name}
              </a>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}