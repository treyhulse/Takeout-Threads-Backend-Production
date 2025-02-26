"use client"

import { Transaction } from "@/types/transactions"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CustomerCombobox } from "@/components/customers/customer-combobox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

interface TransactionCustomerProps {
  transaction: Transaction
  onChange: (customerId: string) => void
}

export function TransactionCustomer({ 
  transaction, 
  onChange 
}: TransactionCustomerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsDialogOpen(true)}
              >
                Change Customer
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsDialogOpen(true)}
            >
              Select Customer
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              No customer assigned to this transaction
            </p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <CustomerCombobox
              value={transaction.customer?.id}
              onChange={(value) => {
                onChange(value)
                setIsDialogOpen(false)
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 