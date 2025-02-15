"use client"

import { Transaction } from "@/types/transactions"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Package, Plus } from "lucide-react"
import { format } from "date-fns"

interface TransactionShipmentsProps {
  transaction: Transaction
  onShippingMethodChange: (method: string) => void
}

const SHIPPING_METHODS = [
  "USPS Ground",
  "USPS Priority",
  "USPS Express",
  "FedEx Ground",
  "FedEx Express",
  "UPS Ground",
  "UPS Express",
]

export function TransactionShipments({ 
  transaction, 
  onShippingMethodChange 
}: TransactionShipmentsProps) {
  return (
    <CardContent className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Shipping Details</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Shipment
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Shipping Method</label>
          <Select
            value={transaction.shipping_method || ""}
            onValueChange={onShippingMethodChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select shipping method" />
            </SelectTrigger>
            <SelectContent>
              {SHIPPING_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tracking Number</label>
          <div className="flex gap-2">
            <Input placeholder="Enter tracking number" />
            <Button variant="outline">Save</Button>
          </div>
        </div>
      </div>

      {/* Shipment Timeline */}
      <div className="mt-6 space-y-4">
        <h4 className="text-sm font-medium">Shipment Timeline</h4>
        <div className="border rounded-md p-4">
          <div className="flex items-center gap-4">
            <Package className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No shipments created yet</p>
              <p className="text-sm text-muted-foreground">
                Add a shipment to start tracking
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  )
} 