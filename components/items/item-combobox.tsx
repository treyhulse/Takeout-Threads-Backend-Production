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
import { getItems } from "@/lib/supabase/items"
import { Item } from "@/types/items"

interface ItemComboboxProps {
  value?: string
  onChange: (value: string, item: Item) => void
}

export function ItemCombobox({ value, onChange }: ItemComboboxProps) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadItems = async () => {
      try {
        const { data } = await getItems()
        if (data) {
          // Convert the Prisma data to our Item type
          const formattedData = data.map(item => ({
              ...item,
              variations: item.variations ?? null,
              metadata: item.metadata ?? null,
              tags: item.tags ?? null,
          })) as unknown as Item[]
          setItems(formattedData)
        }
      } catch (error) {
        console.error("Failed to load items:", error)
      } finally {
        setLoading(false)
      }
    }

    loadItems()
  }, [])

  const selectedItem = items.find(item => item.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? selectedItem?.name : "Select item..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search items..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.id}
                onSelect={() => {
                  onChange(item.id, item)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-sm text-muted-foreground">SKU: {item.sku}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 