"use client"

import { Item } from "@/types/items"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"

interface ItemInventoryProps {
  item: Item
  onUpdate: (data: Partial<Item>) => Promise<void>
}

export function ItemInventory({ item, onUpdate }: ItemInventoryProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    inventory_quantity: item.inventory_quantity || 0,
    low_stock_alert: item.low_stock_alert || 0,
  })

  const handleSubmit = async () => {
    await onUpdate(formData)
    setIsEditing(false)
  }

  const getStockStatus = () => {
    if (!item.low_stock_alert) return "No alert set"
    return item.inventory_quantity <= item.low_stock_alert 
      ? "Low Stock" 
      : "In Stock"
  }

  if (!isEditing) {
    return (
      <CardContent className="space-y-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">Inventory Management</h3>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit Inventory
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Current Stock</h4>
              <p className="text-3xl font-bold">{item.inventory_quantity}</p>
              <p className="text-sm text-muted-foreground">
                {getStockStatus()}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">
                <ArrowUp className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
              <Button variant="outline" size="sm">
                <ArrowDown className="h-4 w-4 mr-2" />
                Remove Stock
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Low Stock Alert</label>
              <p className="text-sm text-muted-foreground">
                Alert when stock falls below: {item.low_stock_alert || "Not set"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    )
  }

  return (
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Current Stock Level</label>
          <Input
            type="number"
            min="0"
            value={formData.inventory_quantity}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              inventory_quantity: parseInt(e.target.value) 
            }))}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Low Stock Alert Threshold</label>
          <Input
            type="number"
            min="0"
            value={formData.low_stock_alert}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              low_stock_alert: parseInt(e.target.value) 
            }))}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      </div>
    </CardContent>
  )
}