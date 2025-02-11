import prisma from '@/utils/db'
import AddressTable from './address-table'
import { AddressModal } from '@/components/addresses/address-modal'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default async function AddressesPage() {
  const addresses = await prisma.addresses.findMany({
    select: {
      id: true,
      street1: true,
      street2: true,
      city: true,
      state: true,
      zip: true,
      country: true,
      verified: true,
      valid: true,
      residential: true,
      easypost_id: true,
      customer: {
        select: {
          first_name: true,
          last_name: true,
          company_name: true,
        }
      }
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Addresses</h1>
        <AddressModal />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Address List</CardTitle>
        </CardHeader>
        <CardContent>
          <AddressTable addresses={addresses} />
        </CardContent>
      </Card>
    </div>
  )
} 