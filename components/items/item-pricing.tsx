"use client"

import { Item } from "@/types/items"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { formatCurrency } from "@/lib/utils"

interface ItemPricingProps {
  item: Item
  onUpdate: (data: Partial<Item>) => Promise<void>
}

export function ItemPricing({ item, onUpdate }: ItemPricingProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [price, setPrice] = useState(item.price || "0")

  const handleSubmit = async () => {
    await onUpdate({ price })
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">Pricing Information</h3>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit Price
          </Button>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Base Price</label>
            <p className="text-2xl font-bold">
              {item.price ? formatCurrency(Number(item.price)) : "No price set"}
            </p>
          </div>
        </div>
      </CardContent>
    )
  }

  return (
    <CardContent className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Base Price</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5">$</span>
            <Input
              type="number"
              step="0.01"
              min="0"
              className="pl-7"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
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