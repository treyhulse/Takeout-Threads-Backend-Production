"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TransactionItemWithDetails } from "@/types/transactionItems"
import { Item } from "@/types/items"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ItemCombobox } from "@/components/items/item-combobox"
import { addTransactionItem, updateTransactionItem, deleteTransactionItem } from "@/lib/supabase/transactionItems"

interface TransactionItemsProps {
  transactionId: string
  items: TransactionItemWithDetails[]
  onUpdate: () => void
}

export function TransactionItems({ transactionId, items, onUpdate }: TransactionItemsProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [unitPrice, setUnitPrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)

  const handleAddItem = async () => {
    if (!selectedItem) return

    try {
      const total = (quantity * unitPrice) - (discount || 0)
      const { error } = await addTransactionItem(transactionId, {
        item_id: selectedItem.id,
        quantity,
        unit_price: unitPrice,
        discount,
        total,
      })

      if (error) throw new Error(error)

      setIsAddingItem(false)
      setSelectedItem(null)
      setQuantity(1)
      setUnitPrice(0)
      setDiscount(0)
      onUpdate()
      toast.success("Item added successfully")
    } catch (error) {
      toast.error("Failed to add item")
    }
  }

  const handleUpdateItem = async (id: string, data: { quantity?: number; unit_price?: number; discount?: number }) => {
    try {
      const item = items.find(i => i.id === id)
      if (!item) return

      const updatedQuantity = data.quantity ?? item.quantity
      const updatedUnitPrice = data.unit_price ?? item.unit_price
      const updatedDiscount = data.discount ?? item.discount ?? 0

      const total = (updatedQuantity * Number(updatedUnitPrice)) - Number(updatedDiscount)

      const { error } = await updateTransactionItem(id, {
        ...data,
        total,
      })

      if (error) throw new Error(error)

      setEditingItem(null)
      onUpdate()
      toast.success("Item updated successfully")
    } catch (error) {
      toast.error("Failed to update item")
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await deleteTransactionItem(id)
      if (error) throw new Error(error)
      onUpdate()
      toast.success("Item removed successfully")
    } catch (error) {
      toast.error("Failed to remove item")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Items</h3>
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Item</label>
                <ItemCombobox
                  value={selectedItem?.id}
                  onChange={(itemId, item) => {
                    setSelectedItem(item)
                    setUnitPrice(Number(item.price || 0))
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unit Price</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount</label>
                <Input
                  type="number"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
              <Button className="w-full" onClick={handleAddItem}>
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No items added yet
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.item.name}</TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Input
                        type="number"
                        min="1"
                        className="w-20"
                        defaultValue={item.quantity}
                        onBlur={(e) => {
                          handleUpdateItem(item.id, { quantity: Number(e.target.value) })
                        }}
                      />
                    ) : (
                      <span className="cursor-pointer" onClick={() => setEditingItem(item.id)}>
                        {item.quantity}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        className="w-24"
                        defaultValue={Number(item.unit_price)}
                        onBlur={(e) => {
                          handleUpdateItem(item.id, { unit_price: Number(e.target.value) })
                        }}
                      />
                    ) : (
                      <span className="cursor-pointer" onClick={() => setEditingItem(item.id)}>
                        ${Number(item.unit_price).toFixed(2)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        className="w-24"
                        defaultValue={Number(item.discount || 0)}
                        onBlur={(e) => {
                          handleUpdateItem(item.id, { discount: Number(e.target.value) })
                        }}
                      />
                    ) : (
                      <span className="cursor-pointer" onClick={() => setEditingItem(item.id)}>
                        ${Number(item.discount || 0).toFixed(2)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    ${Number(item.total).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 