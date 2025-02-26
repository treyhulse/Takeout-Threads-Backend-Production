"use client"

import { useState, useEffect } from "react"
import { Transaction, TransactionItem } from "@/types/transactions"
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
import { Plus, Trash2, Check, X, Pencil } from "lucide-react"
import { ItemCombobox } from "@/components/items/item-combobox"
import { CardContent } from "@/components/ui/card"

interface TransactionItemsProps {
  transaction: Transaction
  onItemsChange: (items: Partial<TransactionItem>[]) => void
}

interface EditableItem extends Partial<TransactionItem> {
  isNew?: boolean
  isEditing?: boolean
}

export function TransactionItems({ transaction, onItemsChange }: TransactionItemsProps) {
  const [items, setItems] = useState<EditableItem[]>(transaction.items || [])
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null)

  useEffect(() => {
    setItems(transaction.items || [])
  }, [transaction.items])

  const handleAddNewRow = () => {
    const newItem: EditableItem = {
      isNew: true,
      isEditing: true,
      quantity: 1,
      unit_price: 0,
      discount: 0,
      total: 0
    }
    setItems([...items, newItem])
    setEditingItem(newItem)
  }

  const handleItemSelect = (itemId: string, selectedItem: Item, editingItem: EditableItem) => {
    const updatedItems = items.map(item => 
      item === editingItem ? {
        ...item,
        item_id: itemId,
        item: {
          id: selectedItem.id,
          name: selectedItem.name,
          sku: selectedItem.sku,
          unit_of_measure: selectedItem.unit_of_measure
        },
        unit_price: Number(selectedItem.price) || 0
      } : item
    )
    setItems(updatedItems)
    calculateTotal(updatedItems)
  }

  const handleInputChange = (
    value: string | number,
    field: keyof EditableItem,
    editingItem: EditableItem
  ) => {
    const updatedItems = items.map(item => {
      if (item === editingItem) {
        const updatedItem = { ...item, [field]: value }
        // Recalculate total
        if (field === 'quantity' || field === 'unit_price' || field === 'discount') {
          const quantity = Number(field === 'quantity' ? value : item.quantity) || 0
          const unitPrice = Number(field === 'unit_price' ? value : item.unit_price) || 0
          const discount = Number(field === 'discount' ? value : item.discount) || 0
          updatedItem.total = (quantity * unitPrice) - discount
        }
        return updatedItem
      }
      return item
    })
    setItems(updatedItems)
    calculateTotal(updatedItems)
  }

  const calculateTotal = (currentItems: EditableItem[]) => {
    const total = currentItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0)
    onItemsChange(currentItems)
  }

  const handleSaveRow = (editingItem: EditableItem) => {
    if (!editingItem.item_id || !editingItem.quantity) return

    const updatedItems = items.map(item =>
      item === editingItem ? { ...item, isEditing: false, isNew: false } : item
    )
    setItems(updatedItems)
    setEditingItem(null)
    calculateTotal(updatedItems)
  }

  const handleDeleteRow = (itemToDelete: EditableItem) => {
    const updatedItems = items.filter(item => item !== itemToDelete)
    setItems(updatedItems)
    calculateTotal(updatedItems)
  }

  const handleEditRow = (item: EditableItem) => {
    const updatedItems = items.map(i => ({
      ...i,
      isEditing: i === item
    }))
    setItems(updatedItems)
    setEditingItem(item)
  }

  const handleCancelEdit = (editingItem: EditableItem) => {
    if (editingItem.isNew) {
      setItems(items.filter(item => item !== editingItem))
    } else {
      const updatedItems = items.map(item =>
        item === editingItem ? { ...item, isEditing: false } : item
      )
      setItems(updatedItems)
    }
    setEditingItem(null)
  }

  return (
    <CardContent className="p-0">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">Items</h3>
        <Button onClick={handleAddNewRow} disabled={!!editingItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add Line
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id || index}>
              <TableCell>
                {item.isEditing ? (
                  <ItemCombobox
                    value={item.item_id}
                    onChange={(id, selectedItem) => handleItemSelect(id, selectedItem, item)}
                  />
                ) : (
                  <div>
                    <div className="font-medium">{item.item?.name}</div>
                    <div className="text-sm text-muted-foreground">{item.item?.sku}</div>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {item.isEditing ? (
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity || ''}
                    onChange={(e) => handleInputChange(Number(e.target.value), 'quantity', item)}
                    className="w-24"
                  />
                ) : (
                  item.quantity
                )}
              </TableCell>
              <TableCell>
                {item.isEditing ? (
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unit_price || ''}
                    onChange={(e) => handleInputChange(Number(e.target.value), 'unit_price', item)}
                    className="w-32"
                  />
                ) : (
                  `$${Number(item.unit_price).toFixed(2)}`
                )}
              </TableCell>
              <TableCell>
                {item.isEditing ? (
                  <Input
                    type="number"
                    step="0.01"
                    value={item.discount || ''}
                    onChange={(e) => handleInputChange(Number(e.target.value), 'discount', item)}
                    className="w-24"
                  />
                ) : (
                  item.discount ? `$${Number(item.discount).toFixed(2)}` : '-'
                )}
              </TableCell>
              <TableCell className="text-right">
                ${Number(item.total).toFixed(2)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  {item.isEditing ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveRow(item)}
                        disabled={!item.item_id || !item.quantity}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCancelEdit(item)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditRow(item)}
                      >
                        <span className="sr-only">Edit</span>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRow(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No items added. Click &quot;Add Line&quot; to add items.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  )
} 