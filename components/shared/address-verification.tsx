"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AddressForm } from "@/components/shared/address-form"
import { Address } from "@/types/addresses"
import { verifyAddress } from "@/lib/easypost/address"
import { toast } from "sonner"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Label } from "@/components/ui/label"
import { MapPin, AlertCircle } from "lucide-react"

interface AddressVerificationProps {
  onAddressSelect: (address: Address) => void
  onCancel?: () => void
  initialAddress?: Partial<Address>
}

type VerificationStatus = "idle" | "verifying" | "verified" | "error"

export function AddressVerification({
  onAddressSelect,
  onCancel,
  initialAddress
}: AddressVerificationProps) {
  const [status, setStatus] = useState<VerificationStatus>("idle")
  const [originalAddress, setOriginalAddress] = useState<Address | null>(null)
  const [verifiedAddresses, setVerifiedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")

  const handleAddressSubmit = async (data: Address) => {
    setStatus("verifying")
    try {
      const result = await verifyAddress(data)
      if (result.verified) {
        setOriginalAddress(data)
        setVerifiedAddresses(result.suggestions)
        setStatus("verified")
      } else {
        toast.error("Unable to verify address")
        setStatus("error")
      }
    } catch (error) {
      toast.error("Error verifying address")
      setStatus("error")
    }
  }

  const handleAddressSelect = () => {
    const selectedAddress = verifiedAddresses.find(a => a.id === selectedAddressId)
    if (selectedAddress) {
      onAddressSelect(selectedAddress)
    }
  }

  if (status === "verified") {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Verify Address</h3>
          <div className="text-sm text-muted-foreground">
            Please select the correct address from the verified options below.
          </div>
        </div>

        <RadioGroup
          value={selectedAddressId}
          onValueChange={setSelectedAddressId}
          className="space-y-4"
        >
          {verifiedAddresses.map((address) => (
            <Card
              key={address.id}
              className={`p-4 cursor-pointer ${
                selectedAddressId === address.id ? "border-primary" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <RadioGroupItem value={address.id} id={address.id} />
                <div className="flex-1">
                  <Label htmlFor={address.id} className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <div>{address.street1}</div>
                      {address.street2 && <div>{address.street2}</div>}
                      <div>
                        {address.city}, {address.state} {address.zip}
                      </div>
                      <div>{address.country}</div>
                    </div>
                  </Label>
                </div>
              </div>
            </Card>
          ))}
        </RadioGroup>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleAddressSelect}
            disabled={!selectedAddressId}
          >
            Use Selected Address
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AddressForm
        initialData={initialAddress}
        onSubmit={handleAddressSubmit}
        isVerifying={status === "verifying"}
      />
      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          Unable to verify address. Please check the address and try again.
        </div>
      )}
    </div>
  )
} 