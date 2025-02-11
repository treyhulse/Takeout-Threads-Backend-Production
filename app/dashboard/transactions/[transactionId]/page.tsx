"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { TransactionItems } from "@/components/transactions/transaction-items"
import { TransactionDetails } from "@/components/transactions/transaction-details"
import { useEffect, useState } from "react"
import { getTransactionById } from "@/lib/supabase/transactions"
import { Transaction } from "@/types/transactions"

export default function TransactionPage({
  params
}: {
  params: { transactionId: string }
}) {
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    const loadTransaction = async () => {
      const data = await getTransactionById(params.transactionId)
      setTransaction(data)
    }
    loadTransaction()
  }, [params.transactionId])

  if (!transaction) return null

  return (
    <div className="p-6 space-y-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push('/dashboard/transactions')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Transactions
      </Button>

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
                items={transaction.items}
                onUpdate={() => router.refresh()}
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