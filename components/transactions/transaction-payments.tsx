"use client"

import { Transaction } from "@/types/transactions"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PaymentMethod, PaymentStatus } from "@prisma/client"
import { formatCurrency } from "@/lib/utils"

interface TransactionPaymentsProps {
  transaction: Transaction
  onPaymentStatusChange: (status: PaymentStatus) => void
  onPaymentMethodChange: (method: PaymentMethod) => void
}

export function TransactionPayments({
  transaction,
  onPaymentStatusChange,
  onPaymentMethodChange,
}: TransactionPaymentsProps) {
  return (
    <CardContent className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Payment Details</h3>
        <Button>Record Payment</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Status</label>
          <Select
            value={transaction.payment_status}
            onValueChange={(value: PaymentStatus) => onPaymentStatusChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(PaymentStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Method</label>
          <Select
            value={transaction.payment_method || ""}
            onValueChange={(value: PaymentMethod) => onPaymentMethodChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(PaymentMethod).map((method) => (
                <SelectItem key={method} value={method}>
                  {method.charAt(0) + method.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        <div className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Payment Summary</h4>
            <span className="text-sm text-muted-foreground">
              Total Due: {formatCurrency(transaction.total_amount)}
            </span>
          </div>
          
          {/* Payment Records would go here */}
          <div className="text-sm text-muted-foreground text-center py-4">
            No payments recorded yet
          </div>
        </div>
      </div>
    </CardContent>
  )
} 