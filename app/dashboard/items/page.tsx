"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { DataTable } from "@/components/ui/DataTable"
import { ColumnDef } from "@tanstack/react-table"

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const fetchItems = async () => {
    try {
      const { data, error } = await getItems()
      if (error) throw new Error(error)
      const formattedData = (data || []).map((item: Item) => ({
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

  // Airtable/NocoDB-like columns
  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={
          row.original.status === 'ACTIVE' ? "default" :
          row.original.status === 'DRAFT' ? "secondary" : "destructive"
        }>
          {row.original.status.toLowerCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => row.original.price ? `$${row.original.price}` : "-",
    },
    {
      accessorKey: "inventory_quantity",
      header: "Inventory",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={e => {
              e.stopPropagation();
              router.push(`/dashboard/items/${row.original.id}`);
            }}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={e => {
              e.stopPropagation();
              handleDeleteItem(row.original.id);
            }}>
              Delete item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

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
      <DataTable
        data={items}
        columns={columns}
        onRowClick={item => router.push(`/dashboard/items/${item.id}`)}
        enableSelection={false}
        enableColumnVisibility={true}
        enablePagination={true}
        enableGlobalFilter={true}
      />
    </div>
  )
}
