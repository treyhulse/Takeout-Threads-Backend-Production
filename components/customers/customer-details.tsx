"use client"

import { Customer } from "@/types/customers"
import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CustomerForm } from "./customer-form"
import { updateCustomer } from "@/lib/supabase/customers"
import { toast } from "sonner"

interface CustomerDetailsProps {
  customer: Customer
}

export function CustomerDetails({ customer }: CustomerDetailsProps) {
  const formattedCustomer = {
    ...customer,
    company_name: customer.company_name || undefined,
    alt_email: customer.alt_email || undefined,
    phone: customer.phone || undefined,
    alt_phone: customer.alt_phone || undefined,
    account_rep: customer.account_rep || undefined,
    customer_category: customer.customer_category || undefined,
    notes: customer.notes || undefined
  }

  const handleUpdateCustomer = async (data: any) => {
    try {
      const { error } = await updateCustomer(customer.id, data)
      if (error) throw new Error(error)
      toast.success("Customer updated successfully")
    } catch (error) {
      toast.error("Failed to update customer")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm 
              initialData={formattedCustomer} 
              onSubmit={handleUpdateCustomer}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
            <p>{customer.first_name} {customer.last_name}</p>
          </div>
          {customer.company_name && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
              <p>{customer.company_name}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Customer ID</h3>
            <p>{customer.customer_id}</p>
          </div>
          {customer.customer_category && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
              <p>{customer.customer_category}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p>{customer.email}</p>
            {customer.alt_email && <p className="text-sm text-muted-foreground">{customer.alt_email}</p>}
          </div>
          {customer.phone && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
              <p>{customer.phone}</p>
              {customer.alt_phone && <p className="text-sm text-muted-foreground">{customer.alt_phone}</p>}
            </div>
          )}
          {customer.account_rep && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Account Representative</h3>
              <p>{customer.account_rep}</p>
            </div>
          )}
        </div>
      </div>

      {customer.notes && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
          <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
        </div>
      )}
    </div>
  )
} 