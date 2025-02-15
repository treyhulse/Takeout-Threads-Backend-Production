"use client"

import { Transaction } from "@/types/transactions"
import { Address } from "@/types/addresses"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Plus } from "lucide-react"

interface TransactionAddressesProps {
  transaction: Transaction
  onBillingChange: (address: Address) => void
  onShippingChange: (address: Address) => void
}

export function TransactionAddresses({
  transaction,
  onBillingChange,
  onShippingChange,
}: TransactionAddressesProps) {
  const formatAddress = (address: Address | null) => {
    if (!address) return null
    return (
      <div className="space-y-1">
        <p className="font-medium">{address.name || address.company}</p>
        <p className="text-sm text-muted-foreground">{address.street1}</p>
        {address.street2 && (
          <p className="text-sm text-muted-foreground">{address.street2}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {address.city}, {address.state} {address.zip}
        </p>
        <p className="text-sm text-muted-foreground">{address.country}</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <div className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">Addresses</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Billing Address */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Billing Address</h4>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>
            
            {transaction.billing_address ? (
              <div className="p-4 rounded-md border">
                {formatAddress(transaction.billing_address)}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2"
                >
                  Change Address
                </Button>
              </div>
            ) : (
              <div className="p-4 rounded-md border border-dashed">
                <div className="flex flex-col items-center justify-center text-center">
                  <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No billing address set
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Shipping Address</h4>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>
            
            {transaction.shipping_address ? (
              <div className="p-4 rounded-md border">
                {formatAddress(transaction.shipping_address)}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2"
                >
                  Change Address
                </Button>
              </div>
            ) : (
              <div className="p-4 rounded-md border border-dashed">
                <div className="flex flex-col items-center justify-center text-center">
                  <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No shipping address set
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 