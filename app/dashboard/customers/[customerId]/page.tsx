import { getCustomer } from "@/lib/supabase/customers"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerDetails } from "@/components/customers/customer-details"
import { CustomerOrders } from "@/components/customers/customer-orders"
import { Button } from "@/components/ui/button"
import AddressTable from '@/components/addresses/address-table'
import { AddressModal } from '@/components/addresses/address-modal'
import prisma from '@/utils/db'
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { CustomerEmails } from "@/components/customers/customer-emails"

export default async function CustomerPage({
  params
}: {
  params: { customerId: string }
}) {
  const { data: customerData, error } = await getCustomer(params.customerId)

  if (error || !customerData) {
    notFound()
  }

  const customer = {
    ...customerData,
    first_name: customerData.first_name || '',
    last_name: customerData.last_name || '',
    company_name: customerData.company_name || '',
    alt_email: customerData.alt_email || '',
    phone: customerData.phone || ''
  }

  // Fetch addresses for this specific customer
  const addresses = await prisma.addresses.findMany({
    where: {
      customer_id: customer.id
    },
    select: {
      id: true,
      address_id: true,
      name: true,
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
    <div className="p-6 space-y-6">
      <Button
        variant="ghost"
        className="mb-4"
        asChild
      >
        <Link href="/dashboard/customers">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Link>
      </Button>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {customer.first_name} {customer.last_name}
          </h1>
          <p className="text-muted-foreground">
            Customer ID: {customer.customer_id}
          </p>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerDetails customer={customer} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="addresses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Addresses</CardTitle>
              <AddressModal customerId={customer.id} />
            </CardHeader>
            <CardContent>
              <AddressTable addresses={addresses} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerOrders customerId={customer.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="emails">
          <Card>
            <CardHeader>
              <CardTitle>Email History</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerEmails 
                customerEmail={customer.email} 
                altEmail={customer.alt_email}
                customerName={`${customer.first_name} ${customer.last_name}`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 