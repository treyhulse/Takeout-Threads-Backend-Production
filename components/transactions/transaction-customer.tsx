"use client"

import { Transaction } from "@/types/transactions"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface TransactionCustomerProps {
  transaction: Transaction
  onChange: (customerId: string) => void
}

export function TransactionCustomer({ 
  transaction, 
  onChange 
}: TransactionCustomerProps) {
  return (
    <div className="rounded-lg border">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
        
        {transaction.customer ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {transaction.customer.company_name || 
                    `${transaction.customer.first_name} ${transaction.customer.last_name}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.customer.email}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Change Customer
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-8"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              No customer assigned to this transaction
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 