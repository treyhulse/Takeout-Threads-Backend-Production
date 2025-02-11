'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ShippingPage() {
  const [fromAddress, setFromAddress] = useState({
    name: '',
    street1: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })

  const [toAddress, setToAddress] = useState({
    name: '',
    street1: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })

  const [parcel, setParcel] = useState({
    length: '',
    width: '',
    height: '',
    weight: '',
  })

  const handleCreateShipment = async () => {
    // TODO: Implement EasyPost API integration
    console.log('Creating shipment...', { fromAddress, toAddress, parcel })
  }

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-4xl font-bold tracking-tight">Shipping</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">From Address</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="from-name">Name</Label>
              <Input
                id="from-name"
                value={fromAddress.name}
                onChange={(e) => setFromAddress({ ...fromAddress, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="from-street">Street Address</Label>
              <Input
                id="from-street"
                value={fromAddress.street1}
                onChange={(e) => setFromAddress({ ...fromAddress, street1: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from-city">City</Label>
                <Input
                  id="from-city"
                  value={fromAddress.city}
                  onChange={(e) => setFromAddress({ ...fromAddress, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="from-state">State</Label>
                <Input
                  id="from-state"
                  value={fromAddress.state}
                  onChange={(e) => setFromAddress({ ...fromAddress, state: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="from-zip">ZIP Code</Label>
              <Input
                id="from-zip"
                value={fromAddress.zip}
                onChange={(e) => setFromAddress({ ...fromAddress, zip: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">To Address</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="to-name">Name</Label>
              <Input
                id="to-name"
                value={toAddress.name}
                onChange={(e) => setToAddress({ ...toAddress, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="to-street">Street Address</Label>
              <Input
                id="to-street"
                value={toAddress.street1}
                onChange={(e) => setToAddress({ ...toAddress, street1: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="to-city">City</Label>
                <Input
                  id="to-city"
                  value={toAddress.city}
                  onChange={(e) => setToAddress({ ...toAddress, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="to-state">State</Label>
                <Input
                  id="to-state"
                  value={toAddress.state}
                  onChange={(e) => setToAddress({ ...toAddress, state: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="to-zip">ZIP Code</Label>
              <Input
                id="to-zip"
                value={toAddress.zip}
                onChange={(e) => setToAddress({ ...toAddress, zip: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Parcel Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="length">Length (in)</Label>
                <Input
                  id="length"
                  type="number"
                  value={parcel.length}
                  onChange={(e) => setParcel({ ...parcel, length: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="width">Width (in)</Label>
                <Input
                  id="width"
                  type="number"
                  value={parcel.width}
                  onChange={(e) => setParcel({ ...parcel, width: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (in)</Label>
                <Input
                  id="height"
                  type="number"
                  value={parcel.height}
                  onChange={(e) => setParcel({ ...parcel, height: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (oz)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={parcel.weight}
                  onChange={(e) => setParcel({ ...parcel, weight: e.target.value })}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleCreateShipment}>
          Create Shipment
        </Button>
      </div>
    </div>
  )
}

  