"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Package2, ChevronLeft, Edit, Trash } from "lucide-react"
import { Item } from "@/types/items"
import { getItemById, updateItem, deleteItem } from "@/lib/supabase/items"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ItemForm } from "@/components/items/item-form"

export default function ItemDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchItem = useCallback(async () => {
    try {
      const { data, error } = await getItemById(params.itemId as string)
      if (error) throw new Error(error)
      setItem(data as Item)
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
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push('/dashboard/items')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Items
      </Button>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Package2 className="h-6 w-6" />
              {item.name}
            </h1>
            <p className="text-muted-foreground">SKU: {item.sku}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Edit Item</DialogTitle>
              </DialogHeader>
              <ItemForm onSubmit={handleUpdateItem} defaultValues={item} />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete Item
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the item.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <Badge variant={
                    item.status === 'ACTIVE' ? "default" :
                    item.status === 'DRAFT' ? "secondary" : "destructive"
                  }>
                    {item.status.toLowerCase()}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium">Type</div>
                  <div>{item.type}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Price</div>
                  <div>{item.price ? `$${item.price}` : 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Unit of Measure</div>
                  <div>{item.unit_of_measure}</div>
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-2">Description</div>
                <div className="text-muted-foreground">
                  {item.description || 'No description provided'}
                </div>
              </div>
              {item.notes && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium mb-2">Notes</div>
                    <div className="text-muted-foreground">{item.notes}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dimensions">
          <Card>
            <CardHeader>
              <CardTitle>Dimensions & Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {item.weight && (
                  <div>
                    <div className="text-sm font-medium">Weight</div>
                    <div>{item.weight} {item.weight_unit?.toLowerCase()}</div>
                  </div>
                )}
                {item.length && (
                  <div>
                    <div className="text-sm font-medium">Length</div>
                    <div>{item.length} {item.length_unit?.toLowerCase()}</div>
                  </div>
                )}
                {item.width && (
                  <div>
                    <div className="text-sm font-medium">Width</div>
                    <div>{item.width} {item.width_unit?.toLowerCase()}</div>
                  </div>
                )}
                {item.depth && (
                  <div>
                    <div className="text-sm font-medium">Depth</div>
                    <div>{item.depth} {item.depth_unit?.toLowerCase()}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Created</div>
                  <div>{new Date(item.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Last Updated</div>
                  <div>{new Date(item.updatedAt).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 