import { getTransactionById } from "@/lib/supabase/transactions"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TransactionItems } from "@/components/transactions/transaction-items"
import { TransactionDetails } from "@/components/transactions/transaction-details"
import { TransactionItemWithDetails } from "@/types/transactionItems"

export default async function TransactionPage({
  params
}: {
  params: { transactionId: string }
}) {
  const transaction = await getTransactionById(params.transactionId)

  if (!transaction) {
    notFound()
  }

  // Convert Prisma Decimal to TransactionItemWithDetails format
  const formattedItems: TransactionItemWithDetails[] = transaction.items.map(item => ({
    ...item,
    unit_price: item.unit_price,
    discount: item.discount,
    total: item.total,
    item: {
      id: item.item.id,
      name: item.item.name,
      sku: item.item.sku,
      unit_of_measure: item.item.unit_of_measure
    }
  }))

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {transaction.number}
          </h1>
          <p className="text-muted-foreground">
            {transaction.customer ? 
              transaction.customer.company_name || 
              `${transaction.customer.first_name} ${transaction.customer.last_name}` 
              : 'No Customer'}
          </p>
        </div>
        <Badge
          variant={
            transaction.status === 'COMPLETED' ? "default" :
            transaction.status === 'PENDING' ? "secondary" :
            transaction.status === 'APPROVED' ? "outline" : "destructive"
          }
        >
          {transaction.status.toLowerCase()}
        </Badge>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <TransactionDetails transaction={transaction} />
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardContent className="pt-6">
              <TransactionItems 
                transactionId={transaction.id}
                items={formattedItems}
                onUpdate={() => {
                  window.location.reload()
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Transaction history component will go here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 