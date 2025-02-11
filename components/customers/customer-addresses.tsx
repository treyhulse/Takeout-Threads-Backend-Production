"use client"

import { useState } from "react"
import { Address } from "@/types/addresses"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Edit2, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddressVerification } from "@/components/shared/address-verification"
import { Badge } from "@/components/ui/badge"
import { deleteAddress, setDefaultAddress } from "@/lib/supabase/addresses"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CustomerAddressesProps {
  customerId: string
  addresses: Address[]
  defaultShippingId?: string
  defaultBillingId?: string
}

export function CustomerAddresses({ 
  customerId, 
  addresses, 
  defaultShippingId,
  defaultBillingId 
}: CustomerAddressesProps) {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [showAddressDialog, setShowAddressDialog] = useState(false)

  const handleAddressSelect = async (address: Address) => {
    setShowAddressDialog(false)
    toast.success("Address added successfully")
  }

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const { error } = await deleteAddress(addressId)
      if (error) throw new Error(error)
      toast.success("Address deleted successfully")
    } catch (error) {
      toast.error("Failed to delete address")
    }
  }

  const handleSetDefaultAddress = async (addressId: string, type: 'shipping' | 'billing') => {
    try {
      const { error } = await setDefaultAddress(customerId, addressId, type)
      if (error) throw new Error(error)
      toast.success(`Default ${type} address updated`)
    } catch (error) {
      toast.error(`Failed to update default ${type} address`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <AddressVerification
              onAddressSelect={handleAddressSelect}
              onCancel={() => setShowAddressDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div 
            key={address.id} 
            className="relative p-4 border rounded-lg space-y-2"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  {address.name && (
                    <p className="font-medium">{address.name}</p>
                  )}
                  {address.company && (
                    <p className="text-sm text-muted-foreground">{address.company}</p>
                  )}
                  <p>{address.street1}</p>
                  {address.street2 && <p>{address.street2}</p>}
                  <p>{address.city}, {address.state} {address.zip}</p>
                  <p>{address.country}</p>
                  {address.verified && (
                    <Badge variant="secondary" className="mt-2">Verified</Badge>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => handleSetDefaultAddress(address.id, 'shipping')}
                  >
                    Set as default shipping
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleSetDefaultAddress(address.id, 'billing')}
                  >
                    Set as default billing
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    Delete address
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex gap-2">
              {address.id === defaultShippingId && (
                <Badge variant="secondary">Default Shipping</Badge>
              )}
              {address.id === defaultBillingId && (
                <Badge variant="secondary">Default Billing</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 