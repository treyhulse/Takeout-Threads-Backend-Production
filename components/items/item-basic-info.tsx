"use client"

import { Item } from "@/types/items"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ItemBasicInfoProps {
  item: Item
  onUpdate: (data: Partial<Item>) => Promise<void>
}

export function ItemBasicInfo({ item, onUpdate }: ItemBasicInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: item.name,
    sku: item.sku,
    description: item.description || "",
    type: item.type,
    status: item.status,
    unit_of_measure: item.unit_of_measure,
  })

  const handleSubmit = async () => {
    await onUpdate(formData)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit Details
          </Button>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">{item.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium">SKU</label>
            <p className="text-sm text-muted-foreground">{item.sku}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <p className="text-sm text-muted-foreground">{item.description || "No description"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <p className="text-sm text-muted-foreground">{item.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Unit of Measure</label>
              <p className="text-sm text-muted-foreground">{item.unit_of_measure}</p>
            </div>
          </div>
        </div>
      </CardContent>
    )
  }

  return (
    <CardContent className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div>
          <label className="text-sm font-medium">SKU</label>
          <Input
            value={formData.sku}
            onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Type</label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PHYSICAL">Physical</SelectItem>
                <SelectItem value="DIGITAL">Digital</SelectItem>
                <SelectItem value="SERVICE">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Unit of Measure</label>
            <Select
              value={formData.unit_of_measure}
              onValueChange={(value) => setFormData(prev => ({ ...prev, unit_of_measure: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EACH">Each</SelectItem>
                <SelectItem value="PAIR">Pair</SelectItem>
                <SelectItem value="CASE">Case</SelectItem>
                <SelectItem value="BOX">Box</SelectItem>
              </SelectContent>
            </Select>
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