"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TransactionType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createTransaction } from "@/lib/supabase/transactions"
import { toast } from "sonner"
import { CustomerCombobox } from "@/components/customers/customer-combobox"

const formSchema = z.object({
  type: z.nativeEnum(TransactionType),
  entity_id: z.string().optional(),
})

export function CreateTransactionModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: TransactionType.SALE,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await createTransaction({
        ...values,
        total: 0,
        items: []
      })
      
      setOpen(false)
      router.push(`/dashboard/transactions/${result.id}`)
      toast.success("Transaction created successfully")
    } catch (error) {
      toast.error("Failed to create transaction")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Quick Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Add Transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TransactionType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entity_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <CustomerCombobox
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create and Continue
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 