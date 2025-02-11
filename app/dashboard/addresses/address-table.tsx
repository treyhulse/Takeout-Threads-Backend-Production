'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Address = {
  id: string
  street1: string
  street2: string | null
  city: string
  state: string
  zip: string
  country: string
  verified: boolean
  valid: 'VALID' | 'INVALID' | 'PENDING'
  residential: boolean | null
  easypost_id: string | null
  customer: {
    first_name: string | null
    last_name: string | null
    company_name: string | null
  }
}

export default function AddressTable({ addresses: initialAddresses }: { addresses: Address[] }) {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)

  const verifyAddress = async (address: Address) => {
    try {
      setVerifyingId(address.id)
      const response = await fetch('/api/address/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address)
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.error)

      // Update the address in the table
      setAddresses(addresses.map(a => 
        a.id === address.id 
          ? { 
              ...a, 
              verified: true, 
              valid: result.data.valid ? 'VALID' : 'INVALID',
              residential: result.data.residential 
            }
          : a
      ))

      toast.success(result.data.valid ? 'Address verified successfully' : 'Address verified but invalid')
    } catch (error) {
      toast.error('Failed to verify address')
    } finally {
      setVerifyingId(null)
    }
  }

  const getValidationBadge = (status: Address['valid']) => {
    switch (status) {
      case 'VALID':
        return <Badge className="bg-green-100 text-green-800">Valid</Badge>
      case 'INVALID':
        return <Badge className="bg-red-100 text-red-800">Invalid</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Validation</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {addresses.map((address) => (
          <TableRow key={address.id}>
            <TableCell>
              {address.customer.company_name || 
                `${address.customer.first_name} ${address.customer.last_name}`}
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{address.street1}</div>
                {address.street2 && <div>{address.street2}</div>}
                <div>
                  {address.city}, {address.state} {address.zip}
                </div>
                <div>{address.country}</div>
              </div>
            </TableCell>
            <TableCell>
              {address.verified ? (
                <Badge className="bg-green-100 text-green-800">Verified</Badge>
              ) : (
                <Badge variant="secondary">Unverified</Badge>
              )}
            </TableCell>
            <TableCell>
              {getValidationBadge(address.valid)}
            </TableCell>
            <TableCell>
              {address.residential === true && (
                <Badge variant="outline">Residential</Badge>
              )}
              {address.residential === false && (
                <Badge variant="outline">Commercial</Badge>
              )}
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => verifyAddress(address)}
                disabled={address.verified || verifyingId === address.id}
                className="w-[100px]"
              >
                {verifyingId === address.id ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Verifying</span>
                  </div>
                ) : (
                  'Verify'
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 