"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Save } from "lucide-react"
import { getTransactionById, updateTransactionDetails } from "@/lib/supabase/transactions"
import { Transaction, TransactionItem } from "@/types/transactions"
import { toast } from "sonner"
import { Address } from "@/types/addresses"
import { cn } from "@/lib/utils"

// Components (these will need to be created)
import { TransactionHeader } from "@/components/transactions/transaction-header"
import { TransactionSummary } from "@/components/transactions/transaction-summary"
import { TransactionCustomer } from "@/components/transactions/transaction-customer"
import { TransactionAddresses } from "@/components/transactions/transaction-addresses"
import { TransactionItems } from "@/components/transactions/transaction-items"
import { TransactionShipments } from "@/components/transactions/transaction-shipments"
import { TransactionPayments } from "@/components/transactions/transaction-payments"
import { TransactionHistory } from "@/components/transactions/transaction-history"
import { TransactionNotes } from "@/components/transactions/transaction-notes"

interface TransactionPageProps {
  params: { transactionId: string }
}

export default function TransactionPage({ params }: TransactionPageProps) {
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // State for tracking changes
  const [changes, setChanges] = useState({
    entity_id: undefined as string | undefined,
    billing_address_id: undefined as string | undefined,
    shipping_address_id: undefined as string | undefined,
    items: [] as Partial<TransactionItem>[],
    status: undefined as string | undefined,
    shipping_method: undefined as string | undefined,
    payment_status: undefined as string | undefined,
    payment_method: undefined as string | undefined,
  })

  const loadTransaction = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getTransactionById(params.transactionId)
      setTransaction(data)
    } catch (error) {
      toast.error("Failed to load transaction")
    } finally {
      setIsLoading(false)
    }
  }, [params.transactionId])

  useEffect(() => {
    loadTransaction()
  }, [params.transactionId, loadTransaction])

  const handleSaveChanges = async () => {
    if (!transaction) return

    setIsSaving(true)
    try {
      // Filter out any items that don't have the required fields
      const validItems = changes.items.filter(item => 
        item.item_id && 
        item.quantity && 
        item.unit_price !== undefined && 
        item.total !== undefined
      )

      const result = await updateTransactionDetails(transaction.id, {
        ...changes,
        items: validItems
      })
      
      if (result.error) throw new Error(result.error)
      
      setTransaction(result.data)
      setChanges({
        entity_id: undefined,
        billing_address_id: undefined,
        shipping_address_id: undefined,
        items: [],
        status: undefined,
        shipping_method: undefined,
        payment_status: undefined,
        payment_method: undefined,
      })
      toast.success("Changes saved successfully")
    } catch (error) {
      toast.error("Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !transaction) {
    return <div className="p-6">Loading...</div>
  }

  const hasChanges = Object.values(changes).some(value => 
    value !== undefined && (Array.isArray(value) ? value.length > 0 : true)
  )

  return (
    <div className="min-h-screen space-y-6 p-6">
      {/* Header with Back Button and Save Changes */}
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
              onClick={() => setChanges({
                entity_id: undefined,
                billing_address_id: undefined,
                shipping_address_id: undefined,
                items: [],
                status: undefined,
                shipping_method: undefined,
                payment_status: undefined,
                payment_method: undefined,
              })}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Transaction Header */}
      <TransactionHeader 
        transaction={transaction}
        onStatusChange={(status) => setChanges(prev => ({ ...prev, status }))}
      />

      {/* Transaction Summary */}
      <TransactionSummary transaction={transaction} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid gap-6 md:grid-cols-2">
            <TransactionCustomer
              transaction={transaction}
              onChange={(customerId) => setChanges(prev => ({ 
                ...prev, 
                entity_id: customerId 
              }))}
            />
            <TransactionAddresses
              transaction={transaction}
              onBillingChange={(address) => setChanges(prev => ({ 
                ...prev, 
                billing_address_id: address.id 
              }))}
              onShippingChange={(address) => setChanges(prev => ({ 
                ...prev, 
                shipping_address_id: address.id 
              }))}
            />
            <TransactionNotes
              transaction={transaction}
              onChange={(notes) => setChanges(prev => ({ ...prev, notes }))}
            />
          </div>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <TransactionItems
              transaction={transaction}
              onItemsChange={(items) => setChanges(prev => ({ ...prev, items }))}
            />
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card>
            <TransactionShipments
              transaction={transaction}
              onShippingMethodChange={(method) => setChanges(prev => ({ 
                ...prev, 
                shipping_method: method 
              }))}
            />
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <TransactionPayments
              transaction={transaction}
              onPaymentStatusChange={(status) => setChanges(prev => ({ 
                ...prev, 
                payment_status: status 
              }))}
              onPaymentMethodChange={(method) => setChanges(prev => ({ 
                ...prev, 
                payment_method: method 
              }))}
            />
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <TransactionHistory transaction={transaction} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 