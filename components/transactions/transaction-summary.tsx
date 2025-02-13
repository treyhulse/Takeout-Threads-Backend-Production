"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { PaymentMethod, PaymentStatus, TransactionType } from "@prisma/client"
import { format } from "date-fns"

interface TransactionSummaryProps {
  transaction: {
    id: string
    type: TransactionType
    total: number
    tax_amount: number
    shipping_cost: number
    total_amount: number
    payment_status: PaymentStatus
    payment_method?: PaymentMethod | null
    created_at: Date
    updated_at: Date
  }
}

export function TransactionSummary({ transaction }: TransactionSummaryProps) {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left column - Transaction Details */}
          <div className="col-span-2 space-y-6">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Type</div>
              <div className="font-medium">{transaction.type}</div>
            </div>
            
            {transaction.payment_method && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Payment Method</div>
                <div className="font-medium">{transaction.payment_method}</div>
              </div>
            )}

            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Created</div>
                <div className="text-sm">{format(new Date(transaction.created_at), 'PPpp')}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Last Modified</div>
                <div className="text-sm">{format(new Date(transaction.updated_at), 'PPpp')}</div>
              </div>
            </div>
          </div>

          {/* Right column - Totals Box */}
          <div className="col-span-1">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(transaction.total)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">{formatCurrency(transaction.tax_amount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{formatCurrency(transaction.shipping_cost)}</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(transaction.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 