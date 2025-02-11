"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface CustomerOrdersProps {
  customerId: string
}

// Placeholder type until we build the orders schema
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

interface Order {
  id: string
  order_number: string
  status: OrderStatus
  total: number
  items: number
  created_at: Date
}

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export function CustomerOrders({ customerId }: CustomerOrdersProps) {
  // This will be replaced with real data once we have the orders table
  const [orders] = useState<Order[]>([
    {
      id: "1",
      order_number: "ORD-001",
      status: "delivered",
      total: 125.99,
      items: 3,
      created_at: new Date("2024-01-15"),
    },
    {
      id: "2",
      order_number: "ORD-002",
      status: "processing",
      total: 299.99,
      items: 2,
      created_at: new Date("2024-02-01"),
    },
  ])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Orders</h2>
          <p className="text-sm text-muted-foreground">
            Manage and view customer orders
          </p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/orders/new?customerId=${customerId}`}>
            Create Order
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.order_number}
                  </TableCell>
                  <TableCell>
                    {format(order.created_at, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[order.status]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell className="text-right">
                    ${order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="float-right"
                    >
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View order</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 