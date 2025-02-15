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
import { Transaction, TransactionItem } from "@/types/transactions"
import { CardContent } from "@/components/ui/card"

interface TransactionItemsProps {
  transaction: Transaction
  onItemsChange: (items: Partial<TransactionItem>[]) => void
}

export function TransactionItems({ transaction, onItemsChange }: TransactionItemsProps) {
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
      const { error } = await addTransactionItem(transaction.id, {
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
      onItemsChange([{ ...transaction.items.find(i => i.item_id === selectedItem.id)!, quantity, unit_price: unitPrice, discount, total }])
      toast.success("Item added successfully")
    } catch (error) {
      toast.error("Failed to add item")
    }
  }

  const handleUpdateItem = async (id: string, data: { quantity?: number; unit_price?: number; discount?: number }) => {
    try {
      const item = transaction.items.find(i => i.item_id === id)
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
      onItemsChange([{ ...item, ...data, total }])
      toast.success("Item updated successfully")
    } catch (error) {
      toast.error("Failed to update item")
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await deleteTransactionItem(id)
      if (error) throw new Error(error)
      onItemsChange(transaction.items.filter(i => i.item_id !== id))
      toast.success("Item removed successfully")
    } catch (error) {
      toast.error("Failed to remove item")
    }
  }

  return (
    <CardContent>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Items</h3>
        <div className="flex justify-between items-center">
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
              {transaction.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No items added yet
                  </TableCell>
                </TableRow>
              ) : (
                transaction.items.map((item) => (
                  <TableRow key={item.item_id}>
                    <TableCell>{item.item.name}</TableCell>
                    <TableCell>
                      {editingItem === item.item_id ? (
                        <Input
                          type="number"
                          min="1"
                          className="w-20"
                          defaultValue={item.quantity}
                          onBlur={(e) => {
                            handleUpdateItem(item.item_id, { quantity: Number(e.target.value) })
                          }}
                        />
                      ) : (
                        <span className="cursor-pointer" onClick={() => setEditingItem(item.item_id)}>
                          {item.quantity}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingItem === item.item_id ? (
                        <Input
                          type="number"
                          step="0.01"
                          className="w-24"
                          defaultValue={Number(item.unit_price)}
                          onBlur={(e) => {
                            handleUpdateItem(item.item_id, { unit_price: Number(e.target.value) })
                          }}
                        />
                      ) : (
                        <span className="cursor-pointer" onClick={() => setEditingItem(item.item_id)}>
                          ${Number(item.unit_price).toFixed(2)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingItem === item.item_id ? (
                        <Input
                          type="number"
                          step="0.01"
                          className="w-24"
                          defaultValue={Number(item.discount || 0)}
                          onBlur={(e) => {
                            handleUpdateItem(item.item_id, { discount: Number(e.target.value) })
                          }}
                        />
                      ) : (
                        <span className="cursor-pointer" onClick={() => setEditingItem(item.item_id)}>
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
                        onClick={() => handleDeleteItem(item.item_id)}
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
    </CardContent>
  )
} 