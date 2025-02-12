'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AddressModal } from "@/components/addresses/address-modal"
import { AddressSelect } from "@/components/addresses/address-select"
import { LocationModal } from "@/components/locations/location-modal"
import { ParcelModal } from "@/components/parcels/parcel-modal"
import { ParcelCommand } from "@/components/parcels/parcel-command"
import { DimensionUnit, WeightUnit } from "@prisma/client"
import { LocationCommand } from "@/components/locations/location-command"

export default function ShippingPage() {
  const [fromAddress, setFromAddress] = useState({
    id: '',
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
    id: '',
    name: '',
    description: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    length_unit: DimensionUnit.INCH,
    width_unit: DimensionUnit.INCH,
    depth_unit: DimensionUnit.INCH,
    weight_unit: WeightUnit.OUNCE,
  })

  const handleCreateShipment = async () => {
    // TODO: Implement EasyPost API integration
    console.log('Creating shipment...', { fromAddress, toAddress, parcel })
  }

  const handleAddressSelect = (address: any) => {
    setToAddress({
      name: address.name || '',
      street1: address.street1,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    });
  };

  const handleParcelSelect = (id: string, selectedParcel: any) => {
    setParcel({
      id,
      name: selectedParcel.name,
      description: selectedParcel.description,
      length: selectedParcel.length.toString(),
      width: selectedParcel.width.toString(),
      height: selectedParcel.depth.toString(),
      weight: selectedParcel.weight.toString(),
      length_unit: selectedParcel.length_unit,
      width_unit: selectedParcel.width_unit,
      depth_unit: selectedParcel.depth_unit,
      weight_unit: selectedParcel.weight_unit,
    })
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold tracking-tight">Shipping</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">From Address</h2>
            <LocationModal />
          </div>
          <div className="space-y-4">
            <LocationCommand
              value={fromAddress.id}
              onChange={(id, location) => {
                setFromAddress({
                  id,
                  name: location.address.name || '',
                  street1: location.address.street1,
                  city: location.address.city,
                  state: location.address.state,
                  zip: location.address.zip,
                  country: location.address.country,
                })
              }}
            />
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">To Address</h2>
            <AddressModal />
          </div>
          <div className="space-y-4">
            <AddressSelect onAddressSelect={handleAddressSelect} />
            
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Parcel Details</h2>
            <ParcelModal />
          </div>
          <div className="space-y-4">
            <ParcelCommand
              value={parcel.id}
              onChange={handleParcelSelect}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length">Length ({parcel.length_unit.toLowerCase()})</Label>
                <Input
                  id="length"
                  type="number"
                  value={parcel.length}
                  onChange={(e) => setParcel({ ...parcel, length: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width ({parcel.width_unit.toLowerCase()})</Label>
                <Input
                  id="width"
                  type="number"
                  value={parcel.width}
                  onChange={(e) => setParcel({ ...parcel, width: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height ({parcel.depth_unit.toLowerCase()})</Label>
                <Input
                  id="height"
                  type="number"
                  value={parcel.height}
                  onChange={(e) => setParcel({ ...parcel, height: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight ({parcel.weight_unit.toLowerCase()})</Label>
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

  