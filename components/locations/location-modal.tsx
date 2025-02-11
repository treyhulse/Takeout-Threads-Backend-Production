'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon } from "lucide-react"
import { AddressSelect } from "@/components/addresses/address-select"
import { createLocation } from "@/lib/supabase/locations"
import { toast } from "sonner"

export function LocationModal() {
  const [open, setOpen] = useState(false)
  const [location, setLocation] = useState({
    name: '',
    description: '',
    address_id: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await createLocation(location)

    if (result.success) {
      setOpen(false)
      toast.success("Location created successfully")
      // Reset form
      setLocation({
        name: '',
        description: '',
        address_id: '',
      })
    } else {
      toast.error("Failed to create location")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" /> Location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Location</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Location Name</Label>
            <Input
              id="name"
              value={location.name}
              onChange={(e) => setLocation({ ...location, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={location.description}
              onChange={(e) => setLocation({ ...location, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Select Address</Label>
            <AddressSelect 
              onAddressSelect={(address) => {
                setLocation({ ...location, address_id: address.id })
              }}
            />
          </div>
          <Button type="submit" className="w-full">Create Location</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 