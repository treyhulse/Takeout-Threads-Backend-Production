"use client"

import { Transaction } from "@/types/transactions"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TransactionDetailsProps {
  transaction: Transaction
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardContent className="pt-6">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Order Number</dt>
              <dd className="text-sm font-semibold">{transaction.number}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd>
                <Badge variant={
                  transaction.status === 'COMPLETED' ? "default" :
                  transaction.status === 'PENDING' ? "secondary" :
                  transaction.status === 'APPROVED' ? "outline" : "destructive"
                }>
                  {transaction.status.toLowerCase()}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Date Created</dt>
              <dd className="text-sm font-semibold">
                {new Date(transaction.created_at).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Total</dt>
              <dd className="text-sm font-semibold">${Number(transaction.total).toFixed(2)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Customer</dt>
              <dd className="text-sm font-semibold">
                {transaction.customer
                  ? transaction.customer.company_name ||
                    `${transaction.customer.first_name} ${transaction.customer.last_name}`
                  : 'No Customer'}
              </dd>
            </div>
            {transaction.customer?.email && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm font-semibold">{transaction.customer.email}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
} 