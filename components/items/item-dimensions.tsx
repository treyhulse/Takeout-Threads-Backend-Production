"use client"

import { Item } from "@/types/items"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ItemDimensionsProps {
  item: Item
  onUpdate: (data: Partial<Item>) => Promise<void>
}

export function ItemDimensions({ item, onUpdate }: ItemDimensionsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    weight: item.weight || "",
    weight_unit: item.weight_unit || "POUND",
    length: item.length || "",
    width: item.width || "",
    depth: item.depth || "",
    length_unit: item.length_unit || "INCH",
  })

  const handleSubmit = async () => {
    await onUpdate(formData)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <CardContent className="space-y-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">Dimensions & Weight</h3>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit Dimensions
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Weight</label>
              <p className="text-sm text-muted-foreground">
                {item.weight ? `${item.weight} ${item.weight_unit?.toLowerCase()}s` : "Not set"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Dimensions</label>
              <p className="text-sm text-muted-foreground">
                {item.length && item.width && item.depth
                  ? `${item.length} × ${item.width} × ${item.depth} ${item.length_unit?.toLowerCase()}`
                  : "Not set"}
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Weight</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Weight Unit</label>
            <Select
              value={formData.weight_unit}
              onValueChange={(value) => setFormData(prev => ({ ...prev, weight_unit: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="POUND">Pound</SelectItem>
                <SelectItem value="OUNCE">Ounce</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Length</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.length}
              onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Width</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.width}
              onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Depth</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.depth}
              onChange={(e) => setFormData(prev => ({ ...prev, depth: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Dimension Unit</label>
          <Select
            value={formData.length_unit}
            onValueChange={(value) => setFormData(prev => ({ 
              ...prev, 
              length_unit: value,
              width_unit: value,
              depth_unit: value 
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCH">Inch</SelectItem>
              <SelectItem value="CENTIMETER">Centimeter</SelectItem>
              <SelectItem value="FOOT">Foot</SelectItem>
            </SelectContent>
          </Select>
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