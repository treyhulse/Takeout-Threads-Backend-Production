"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomerCombobox } from "@/components/customers/customer-combobox"
import { AddressSelect } from "@/components/addresses/address-select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Address } from "@/types/addresses"

interface TransactionCustomerDetailsProps {
  customerId?: string
  billingAddressId?: string
  shippingAddressId?: string
  onCustomerChange: (id: string) => void
  onBillingAddressChange: (address: Address) => void
  onShippingAddressChange: (address: Address) => void
  pendingChanges: {
    entity_id?: string
    billing_address_id?: string
    shipping_address_id?: string
  }
}

export function TransactionCustomerDetails({
  customerId,
  billingAddressId,
  shippingAddressId,
  onCustomerChange,
  onBillingAddressChange,
  onShippingAddressChange
}: TransactionCustomerDetailsProps) {
  const [sameAsShipping, setSameAsShipping] = useState(false)

  const handleShippingAddressChange = (address: Address) => {
    onShippingAddressChange(address)
    if (sameAsShipping) {
      onBillingAddressChange(address)
    }
  }

  useEffect(() => {
    if (sameAsShipping && shippingAddressId) {
      const address: Address = {
        id: shippingAddressId,
        address_id: shippingAddressId,
        org_id: '',
        customer_id: customerId || '',
        street1: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        verified: false,
        created_at: new Date(),
        updated_at: new Date()
      }
      onBillingAddressChange(address)
    }
  }, [onBillingAddressChange, sameAsShipping, shippingAddressId, customerId])

  const handleBillingAddressSelect = (address: Address) => {
    onBillingAddressChange(address)
  }

  const handleShippingAddressSelect = (address: Address) => {
    onShippingAddressChange(address)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Customer</Label>
          <CustomerCombobox 
            value={customerId} 
            onChange={onCustomerChange} 
          />
        </div>

        <div className="space-y-2">
          <Label>Shipping Address</Label>
          <AddressSelect 
            value={shippingAddressId}
            onAddressSelect={handleShippingAddressSelect} 
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="sameAsShipping"
            checked={sameAsShipping}
            onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
          />
          <Label htmlFor="sameAsShipping">Billing address same as shipping</Label>
        </div>

        {!sameAsShipping && (
          <div className="space-y-2">
            <Label>Billing Address</Label>
            <AddressSelect 
              value={billingAddressId}
              onAddressSelect={handleBillingAddressSelect} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
} 