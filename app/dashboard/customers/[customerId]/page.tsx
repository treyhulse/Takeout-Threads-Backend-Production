import { getCustomer } from "@/lib/supabase/customers"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerDetails } from "@/components/customers/customer-details"
import { CustomerOrders } from "@/components/customers/customer-orders"
import { Button } from "@/components/ui/button"

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

  return (
    <div className="p-6 space-y-6">
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
              <CardHeader>
              <CardTitle>Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              <Button>Add Address</Button>
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
      </Tabs>
    </div>
  )
} 