'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusIcon } from "lucide-react"
import { createParcel } from '@/lib/supabase/parcels'
import { CreateParcelInput } from '@/types/parcels'
import { DimensionUnit, WeightUnit } from '@prisma/client'

export function ParcelModal() {
  const [open, setOpen] = useState(false)
  const [parcel, setParcel] = useState<Omit<CreateParcelInput, 'org_id'>>({
    name: '',
    description: '',
    length: 0,
    length_unit: DimensionUnit.INCH,
    width: 0,
    width_unit: DimensionUnit.INCH,
    depth: 0,
    depth_unit: DimensionUnit.INCH,
    weight: 0,
    weight_unit: WeightUnit.OUNCE,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await createParcel(parcel)

    if (result.success) {
      setOpen(false)
      toast.success("Parcel created successfully")
      // Reset form
      setParcel({
        name: '',
        description: '',
        length: 0,
        length_unit: DimensionUnit.INCH,
        width: 0,
        width_unit: DimensionUnit.INCH,
        depth: 0,
        depth_unit: DimensionUnit.INCH,
        weight: 0,
        weight_unit: WeightUnit.OUNCE,
      })
    } else {
      toast.error("Failed to create parcel")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" /> Parcel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Parcel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Parcel Name</Label>
            <Input
              id="name"
              value={parcel.name}
              onChange={(e) => setParcel({ ...parcel, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={parcel.description}
              onChange={(e) => setParcel({ ...parcel, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                value={parcel.weight}
                onChange={(e) => setParcel({ ...parcel, weight: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight-unit">Weight Unit</Label>
              <Select
                value={parcel.weight_unit}
                onValueChange={(value) => setParcel({ ...parcel, weight_unit: value as WeightUnit })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select weight unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={WeightUnit.OUNCE}>Ounce</SelectItem>
                  <SelectItem value={WeightUnit.POUND}>Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Input
                  id="length"
                  type="number"
                  value={parcel.length}
                  onChange={(e) => setParcel({ ...parcel, length: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={parcel.width}
                  onChange={(e) => setParcel({ ...parcel, width: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="depth">Depth</Label>
                <Input
                  id="depth"
                  type="number"
                  value={parcel.depth}
                  onChange={(e) => setParcel({ ...parcel, depth: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="length-unit">Length Unit</Label>
                <Select
                  value={parcel.length_unit}
                  onValueChange={(value) => setParcel({ ...parcel, length_unit: value as DimensionUnit })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DimensionUnit.INCH}>Inch</SelectItem>
                    <SelectItem value={DimensionUnit.CENTIMETER}>Centimeter</SelectItem>
                    <SelectItem value={DimensionUnit.FOOT}>Foot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="width-unit">Width Unit</Label>
                <Select
                  value={parcel.width_unit}
                  onValueChange={(value) => setParcel({ ...parcel, width_unit: value as DimensionUnit })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DimensionUnit.INCH}>Inch</SelectItem>
                    <SelectItem value={DimensionUnit.CENTIMETER}>Centimeter</SelectItem>
                    <SelectItem value={DimensionUnit.FOOT}>Foot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="depth-unit">Depth Unit</Label>
                <Select
                  value={parcel.depth_unit}
                  onValueChange={(value) => setParcel({ ...parcel, depth_unit: value as DimensionUnit })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DimensionUnit.INCH}>Inch</SelectItem>
                    <SelectItem value={DimensionUnit.CENTIMETER}>Centimeter</SelectItem>
                    <SelectItem value={DimensionUnit.FOOT}>Foot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full">Create Parcel</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 