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
import { Loader2, Trash2, CheckCircle2, XCircle, AlertCircle, MoreVertical } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteAddress, updateAddress } from '@/lib/supabase/addresses'

type Address = {
  id: string
  address_id: string
  name: string | null
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
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState<{ id: string; value: string } | null>(null)

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

  const handleDelete = async (address: Address) => {
    try {
      setDeletingId(address.id)
      const result = await deleteAddress(address.address_id)
      
      if (result.error) {
        throw new Error(result.error)
      }

      setAddresses(addresses.filter(a => a.id !== address.id))
      toast.success('Address deleted successfully')
    } catch (error) {
      toast.error('Failed to delete address')
    } finally {
      setDeletingId(null)
    }
  }

  const handleNameUpdate = async (address: Address, newName: string) => {
    if (newName === address.name) return
    
    try {
      setUpdatingId(address.id)
      const result = await updateAddress(address.address_id, { name: newName })
      
      if (result.error) {
        throw new Error(result.error)
      }

      setAddresses(addresses.map(a => 
        a.id === address.id ? { ...a, name: newName } : a
      ))
      toast.success('Address name updated')
    } catch (error) {
      toast.error('Failed to update address name')
    } finally {
      setUpdatingId(null)
    }
  }

  const getVerificationButton = (address: Address) => {
    if (verifyingId === address.id) {
      return (
        <Button
          variant="outline"
          size="sm"
          disabled
          className="w-[120px]"
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verifying
        </Button>
      )
    }

    if (address.verified) {
      switch (address.valid) {
        case 'VALID':
          return (
            <Button variant="outline" size="sm" className="w-[120px] text-green-600" disabled>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Valid
            </Button>
          )
        case 'INVALID':
          return (
            <Button variant="outline" size="sm" className="w-[120px] text-red-600" disabled>
              <XCircle className="mr-2 h-4 w-4" />
              Invalid
            </Button>
          )
        default:
          return (
            <Button variant="outline" size="sm" className="w-[120px] text-yellow-600" disabled>
              <AlertCircle className="mr-2 h-4 w-4" />
              Pending
            </Button>
          )
      }
    }

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => verifyAddress(address)}
        className="w-[120px]"
      >
        Verify
      </Button>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Street</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>City</TableHead>
          <TableHead>State</TableHead>
          <TableHead>ZIP</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {addresses.map((address) => (
          <TableRow key={address.id} className="h-12">
            <TableCell>
              <input
                type="text"
                value={editingName?.id === address.id ? editingName.value : (address.name || '')}
                disabled={updatingId === address.id}
                onChange={(e) => setEditingName({ id: address.id, value: e.target.value })}
                onFocus={() => setEditingName({ id: address.id, value: address.name || '' })}
                onBlur={() => {
                  if (editingName?.id === address.id) {
                    handleNameUpdate(address, editingName.value)
                    setEditingName(null)
                  }
                }}
                className={`w-full p-2 border rounded hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                  updatingId === address.id ? 'opacity-50' : ''
                }`}
              />
            </TableCell>
            <TableCell className="max-w-[200px] truncate">
              {address.street1}
            </TableCell>
            <TableCell className="max-w-[100px] truncate">
              {address.street2 || '-'}
            </TableCell>
            <TableCell>
              {address.city}
            </TableCell>
            <TableCell>
              {address.state}
            </TableCell>
            <TableCell>
              {address.zip}
            </TableCell>
            <TableCell>
              {address.residential === true && (
                <Badge variant="outline">Residential</Badge>
              )}
              {address.residential === false && (
                <Badge variant="outline">Commercial</Badge>
              )}
            </TableCell>
            <TableCell className="text-right space-x-2">
              {getVerificationButton(address)}
              
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Address</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this address? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(address)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 