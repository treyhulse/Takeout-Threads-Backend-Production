"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Filter, MoreHorizontal, Plus, Search, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CustomerForm } from "@/components/customers/customer-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// TODO: Create these functions in lib/supabase/customers.ts
import { getCustomers, createCustomer, deleteCustomer } from "@/lib/supabase/customers"

export default function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchCustomers = async () => {
    try {
      const { data, error } = await getCustomers()
      if (error) throw new Error(error)
      setCustomers(data || [])
    } catch (error) {
      toast.error("Failed to fetch customers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleCreateCustomer = async (data: any) => {
    try {
      const { error } = await createCustomer(data)
      if (error) throw new Error(error)
      fetchCustomers()
      toast.success("Customer created successfully")
    } catch (error) {
      toast.error("Failed to create customer")
    }
  }

  const handleDeleteCustomer = async (id: string) => {
    try {
      const { error } = await deleteCustomer(id)
      if (error) throw new Error(error)
      fetchCustomers()
      toast.success("Customer deleted successfully")
    } catch (error) {
      toast.error("Failed to delete customer")
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.customer_id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm onSubmit={handleCreateCustomer} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search customers..." 
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
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="h-4 w-[200px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[150px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[100px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[120px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[100px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-[32px] animate-pulse rounded bg-muted"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow 
                    key={customer.id}
                    className="group cursor-pointer"
                    onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
                  >
                    <TableCell className="group-hover:bg-muted">
                      <div>
                        <div className="font-medium">
                          {customer.first_name} {customer.last_name}
                        </div>
                        {customer.company_name && (
                          <div className="text-sm text-muted-foreground">
                            {customer.company_name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="group-hover:bg-muted">{customer.email}</TableCell>
                    <TableCell className="group-hover:bg-muted">{customer.customer_id}</TableCell>
                    <TableCell className="group-hover:bg-muted">{customer.phone || "-"}</TableCell>
                    <TableCell className="group-hover:bg-muted">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="group-hover:bg-muted">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            Delete customer
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

