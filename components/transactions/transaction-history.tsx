"use client"

import { Transaction } from "@/types/transactions"
import { CardContent } from "@/components/ui/card"
import { format } from "date-fns"

interface TransactionHistoryProps {
  transaction: Transaction
}

export function TransactionHistory({ transaction }: TransactionHistoryProps) {
  // This would typically come from a separate table tracking changes
  const historyEvents = [
    {
      id: 1,
      type: "CREATED",
      description: "Transaction created",
      timestamp: transaction.created_at,
      user: "System",
    },
    {
      id: 2,
      type: "UPDATED",
      description: "Transaction last updated",
      timestamp: transaction.updated_at,
      user: "System",
    },
  ]

  return (
    <CardContent>
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        
        <div className="space-y-4">
          {historyEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-4 border-l-2 border-muted pl-4"
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{event.description}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{format(new Date(event.timestamp), 'PPpp')}</span>
                  <span className="mx-2">•</span>
                  <span>{event.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  )
} 