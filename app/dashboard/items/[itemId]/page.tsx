"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  Package2, ChevronLeft, Edit, Trash, 
  History, DollarSign, Box, Truck 
} from "lucide-react"
import { Item } from "@/types/items"
import { getItemById, updateItem, deleteItem } from "@/lib/supabase/items"
import { toast } from "sonner"

// Components
import { ItemBasicInfo } from "@/components/items/item-basic-info"
import { ItemPricing } from "@/components/items/item-pricing"
import { ItemInventory } from "@/components/items/item-inventory"
import { ItemDimensions } from "@/components/items/item-dimensions"
import { ItemTransactionHistory } from "@/components/items/item-transaction-history"
import { ItemImages } from "@/components/items/item-images"
import { ItemForm } from "@/components/items/item-form"
import { PreviewButton } from "@/components/items/preview-button"
import { Dialog, DialogTitle, DialogHeader, DialogContent } from "@/components/ui/dialog"

export default function ItemDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const fetchItem = useCallback(async () => {
    try {
      const { data, error } = await getItemById(params.itemId as string)
      if (error) throw new Error(error)
      setItem(data as unknown as Item)
    } catch (error) {
      toast.error("Failed to fetch item")
      router.push("/dashboard/items")
    } finally {
      setLoading(false)
    }
  }, [params.itemId, router])

  useEffect(() => {
    fetchItem()
  }, [params.itemId, fetchItem])

  const handleUpdateItem = async (data: Partial<Item>) => {
    try {
      const { error } = await updateItem(params.itemId as string, data)
      if (error) throw new Error(error)
      fetchItem()
      toast.success("Item updated successfully")
    } catch (error) {
      toast.error("Failed to update item")
    }
  }

  const handleDeleteItem = async () => {
    try {
      const { error } = await deleteItem(params.itemId as string)
      if (error) throw new Error(error)
      toast.success("Item deleted successfully")
      router.push("/dashboard/items")
    } catch (error) {
      toast.error("Failed to delete item")
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-[200px] animate-pulse rounded bg-muted mb-4"></div>
        <div className="h-[400px] animate-pulse rounded-lg bg-muted"></div>
      </div>
    )
  }

  if (!item) return null

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/items')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Items
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <PreviewButton itemSku={item.sku} itemName={item.name} />
        </div>
      </div>

      {/* Title Section */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package2 className="h-6 w-6" />
            {item.name}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>SKU: {item.sku}</span>
            <Badge variant={
              item.status === 'ACTIVE' ? "default" :
              item.status === 'DRAFT' ? "secondary" : "destructive"
            }>
              {item.status.toLowerCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">
            <Package2 className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <DollarSign className="h-4 w-4 mr-2" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Box className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="shipping">
            <Truck className="h-4 w-4 mr-2" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid gap-6 md:grid-cols-2">
            <ItemImages item={item} onUpdate={setItem} />
            <ItemBasicInfo item={item} onUpdate={handleUpdateItem} />
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <ItemPricing item={item} onUpdate={handleUpdateItem} />
        </TabsContent>

        <TabsContent value="inventory">
          <ItemInventory item={item} onUpdate={handleUpdateItem} />
        </TabsContent>

        <TabsContent value="shipping">
          <ItemDimensions item={item} onUpdate={handleUpdateItem} />
        </TabsContent>

        <TabsContent value="history">
          <ItemTransactionHistory itemId={item.id} />
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <ItemForm 
            defaultValues={item} 
            onSubmit={async (data) => {
              await handleUpdateItem(data)
              setIsEditing(false)
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}