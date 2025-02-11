"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getCustomers } from "@/lib/supabase/customers"

interface CustomerOption {
  value: string
  label: string
}

interface CustomerComboboxProps {
  value?: string
  onChange: (value: string) => void
}

export function CustomerCombobox({ value, onChange }: CustomerComboboxProps) {
  const [open, setOpen] = useState(false)
  const [customers, setCustomers] = useState<CustomerOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const { data } = await getCustomers()
        if (data) {
          const options = data.map(customer => ({
            value: customer.id,
            label: customer.company_name || 
              `${customer.first_name} ${customer.last_name}`.trim() ||
              customer.email
          }))
          setCustomers(options)
        }
      } catch (error) {
        console.error("Failed to load customers:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [])

  const selectedCustomer = customers.find(customer => customer.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? selectedCustomer?.label : "Select customer..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search customers..." />
          <CommandEmpty>No customer found.</CommandEmpty>
          <CommandGroup>
            {customers.map((customer) => (
              <CommandItem
                key={customer.value}
                value={customer.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === customer.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {customer.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 