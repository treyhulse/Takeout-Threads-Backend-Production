"use client"

import { Transaction } from "@/types/transactions"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TransactionStatus } from "@prisma/client"

interface TransactionHeaderProps {
  transaction: Transaction
  onStatusChange: (status: TransactionStatus) => void
}

export function TransactionHeader({ transaction, onStatusChange }: TransactionHeaderProps) {
  const getStatusColor = (status: TransactionStatus) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      APPROVED: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      COMPLETED: "bg-green-100 text-green-800 hover:bg-green-200",
      CANCELED: "bg-red-100 text-red-800 hover:bg-red-200",
    }
    return colors[status] || "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              {transaction.number}
            </h2>
            <p className="text-sm text-muted-foreground">
              Transaction Type: {transaction.type.charAt(0) + transaction.type.slice(1).toLowerCase()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge 
              variant="secondary"
              className={getStatusColor(transaction.status)}
            >
              {transaction.status}
            </Badge>
            <Select
              value={transaction.status}
              onValueChange={(value: TransactionStatus) => onStatusChange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TransactionStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 