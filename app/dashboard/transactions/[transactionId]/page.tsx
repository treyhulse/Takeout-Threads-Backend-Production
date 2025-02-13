"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { TransactionItems } from "@/components/transactions/transaction-items"
import { useEffect } from "react"
import { getTransactionById, updateTransactionDetails } from "@/lib/supabase/transactions"
import { Transaction } from "@/types/transactions"
import { TransactionCustomerDetails } from "@/components/transactions/transaction-customer-details"
import { TransactionSummary } from "@/components/transactions/transaction-summary"
import { toast } from "sonner"
import { Address } from "@/types/addresses"
import { cn } from "@/lib/utils"

export default function TransactionPage({
  params
}: {
  params: { transactionId: string }
}) {
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [pendingChanges, setPendingChanges] = useState({
    entity_id: undefined as string | undefined,
    billing_address_id: undefined as string | undefined,
    shipping_address_id: undefined as string | undefined,
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadTransaction = async () => {
      const data = await getTransactionById(params.transactionId)
      setTransaction(data)
    }
    loadTransaction()
  }, [params.transactionId])

  const handleBillingAddressChange = (address: Address) => {
    setPendingChanges(prev => ({
      ...prev,
      billing_address_id: address.id
    }))
  }

  const handleShippingAddressChange = (address: Address) => {
    setPendingChanges(prev => ({
      ...prev,
      shipping_address_id: address.id
    }))
  }

  const handleCustomerChange = (customerId: string) => {
    setPendingChanges(prev => ({
      ...prev,
      entity_id: customerId
    }))
  }

  const handleSaveChanges = async () => {
    if (!transaction) return

    const changes = Object.entries(pendingChanges).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key as keyof typeof pendingChanges] = value
      }
      return acc
    }, {} as Partial<typeof pendingChanges>)

    if (Object.keys(changes).length === 0) {
      toast.info("No changes to save")
      return
    }

    setIsSaving(true)
    try {
      const result = await updateTransactionDetails(transaction.id, changes)
      if (result.error) {
        throw new Error(result.error)
      }
      setTransaction(result.data)
      setPendingChanges({
        entity_id: undefined,
        billing_address_id: undefined,
        shipping_address_id: undefined,
      })
      toast.success("Changes saved successfully")
    } catch (error) {
      toast.error("Failed to save changes")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!transaction) return null

  const hasChanges = Object.values(pendingChanges).some(value => value !== undefined)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/transactions')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Transactions
        </Button>
        {hasChanges && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPendingChanges({
                entity_id: undefined,
                billing_address_id: undefined,
                shipping_address_id: undefined,
              })}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {transaction.number}
            </h1>
            <div className={cn(
              "px-3 py-1 rounded-md text-sm font-medium",
              transaction.status === "COMPLETED" && "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100",
              transaction.status === "PENDING" && "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100",
              transaction.status === "APPROVED" && "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100",
              transaction.status === "CANCELED" && "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100"
            )}>
              {transaction.status.charAt(0) + transaction.status.slice(1).toLowerCase()}
            </div>
          </div>
          <p className="text-muted-foreground mt-1">
            {transaction.customer ? 
              transaction.customer.company_name || 
              `${transaction.customer.first_name} ${transaction.customer.last_name}` 
              : 'No Customer'}
          </p>
        </div>
      </div>

      <TransactionSummary transaction={transaction} />

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="space-y-6">
            <TransactionCustomerDetails
              customerId={transaction.entity_id || undefined}
              billingAddressId={transaction.billing_address_id || undefined}
              shippingAddressId={transaction.shipping_address_id || undefined}
              onCustomerChange={handleCustomerChange}
              onBillingAddressChange={handleBillingAddressChange}
              onShippingAddressChange={handleShippingAddressChange}
              pendingChanges={pendingChanges}
            />
          </div>
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