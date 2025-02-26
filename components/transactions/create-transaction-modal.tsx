"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TransactionType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { createTransaction } from "@/lib/supabase/transactions"
import { toast } from "sonner"
import { CustomerCombobox } from "@/components/customers/customer-combobox"

export function CreateTransactionModal() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<TransactionType | null>(null)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)

  const handleTypeSelect = async (type: TransactionType) => {
    setSelectedType(type)
    setIsCustomerDialogOpen(true)
  }

  const handleCreateTransaction = async () => {
    if (!selectedType) return

    try {
      const result = await createTransaction({
        type: selectedType,
        entity_id: customerId || undefined,
        total: 0,
        items: []
      })
      
      setIsCustomerDialogOpen(false)
      setSelectedType(null)
      setCustomerId(null)
      router.push(`/dashboard/transactions/${result.id}`)
      toast.success("Transaction created successfully")
    } catch (error) {
      toast.error("Failed to create transaction")
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {Object.values(TransactionType).map((type) => (
            <DropdownMenuItem
              key={type}
              onClick={() => handleTypeSelect(type)}
              className="cursor-pointer"
            >
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Customer (Optional)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <CustomerCombobox
              value={customerId || undefined}
              onChange={(value) => setCustomerId(value)}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => handleCreateTransaction()}
              >
                Skip
              </Button>
              <Button
                onClick={() => handleCreateTransaction()}
                disabled={!customerId}
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 