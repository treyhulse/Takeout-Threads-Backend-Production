"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Filter, MoreHorizontal, Package2, Search } from "lucide-react"
import { Item, ItemImage } from "@/types/items"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ItemForm } from "@/components/items/item-form"
import { toast } from "sonner"
import { getItems, createItem, deleteItem } from "@/lib/supabase/items"
import { useRouter } from "next/navigation"

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const fetchItems = async () => {
    try {
      const { data, error } = await getItems()
      if (error) throw new Error(error)
      const formattedData = (data || []).map(item => ({
        ...item,
        images: (item.images as unknown as ItemImage[]) || undefined,
        price: item.price?.toString() ?? null,
        weight: item.weight?.toString() ?? null,
        length: item.length?.toString() ?? null,
        width: item.width?.toString() ?? null,
        depth: item.depth?.toString() ?? null,
      })) as Item[]
      setItems(formattedData)
    } catch (error) {
      toast.error("Failed to fetch items")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleCreateItem = async (data: Partial<Item>) => {
    try {
      const { error } = await createItem(data)
      if (error) throw new Error(error)
      fetchItems()
      toast.success("Item created successfully")
    } catch (error) {
      toast.error("Failed to create item")
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await deleteItem(id)
      if (error) throw new Error(error)
      fetchItems()
      toast.success("Item deleted successfully")
    } catch (error) {
      toast.error("Failed to delete item")
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Items</h1>
          <p className="text-muted-foreground">Manage your item catalog</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={items.length < 2 ? 'pulse' : 'default'}>
              <Package2 className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <ItemForm onSubmit={handleCreateItem} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search items..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="h-4 w-[200px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[100px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[80px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[100px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[100px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[32px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No items found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow 
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/dashboard/items/${item.id}`)}
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>
                      <Badge variant={
                        item.status === 'ACTIVE' ? "default" :
                        item.status === 'DRAFT' ? "secondary" : "destructive"
                      }>
                        {item.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/items/${item.id}`);
                          }}>
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item.id);
                            }}
                          >
                            Delete item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
