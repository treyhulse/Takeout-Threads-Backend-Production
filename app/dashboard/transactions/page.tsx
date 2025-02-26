"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getTransactions } from "@/lib/supabase/transactions"
import { Transaction } from "@/types/transactions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Filter, Search, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { CreateTransactionModal } from "@/components/transactions/create-transaction-modal"

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchTransactions = async () => {
    try {
      const { data, error } = await getTransactions()
      if (error) throw new Error(error)
      const safeData = data?.map(item => ({
        ...item,
        billing_address: null,
        shipping_address: null,
        shipments: [],
        discount_total: Number(item.discount_total),
        total: Number(item.total),
        tax_amount: Number(item.tax_amount),
        shipping_cost: Number(item.shipping_cost),
        total_amount: Number(item.total_amount),
        items: item.items.map(i => ({ ...i, created_at: new Date() }))
      })) || []
      setTransactions(safeData)
    } catch (error) {
      toast.error("Failed to fetch transactions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/transactions/${id}`)
  }

  const filteredTransactions = transactions.filter(transaction =>
    transaction.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.customer?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${transaction.customer?.first_name} ${transaction.customer?.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Manage your sales and orders</p>
        </div>
        <CreateTransactionModal />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search transactions..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="h-4 w-[100px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[100px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[200px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[80px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[100px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[32px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow 
                    key={transaction.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(transaction.id)}
                  >
                    <TableCell>{transaction.number}</TableCell>
                    <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {transaction.customer
                        ? transaction.customer.company_name ||
                          `${transaction.customer.first_name} ${transaction.customer.last_name}`
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        transaction.status === 'COMPLETED' ? "default" :
                        transaction.status === 'PENDING' ? "secondary" :
                        transaction.status === 'APPROVED' ? "outline" : "destructive"
                      }>
                        {transaction.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${Number(transaction.total).toFixed(2)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRowClick(transaction.id)}>
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete transaction
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

