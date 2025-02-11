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
import { getParcels } from "@/lib/supabase/parcels"
import { Parcel } from "@/types/parcels"

interface ParcelCommandProps {
  value?: string
  onChange: (value: string, parcel: Parcel) => void
}

export function ParcelCommand({ value, onChange }: ParcelCommandProps) {
  const [open, setOpen] = useState(false)
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadParcels = async () => {
      try {
        const { data } = await getParcels()
        if (data) {
          // Convert Decimal values to numbers for client-side use
          const formattedData = data.map(parcel => ({
            ...parcel,
            length: Number(parcel.length),
            width: Number(parcel.width),
            depth: Number(parcel.depth),
            weight: Number(parcel.weight),
          }))
          setParcels(formattedData)
        }
      } catch (error) {
        console.error("Failed to load parcels:", error)
      } finally {
        setLoading(false)
      }
    }

    loadParcels()
  }, [])

  const selectedParcel = parcels.find(parcel => parcel.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? selectedParcel?.name : "Select parcel..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search parcels..." />
          <CommandEmpty>No parcel found.</CommandEmpty>
          <CommandGroup>
            {parcels.map((parcel) => (
              <CommandItem
                key={parcel.id}
                value={parcel.id}
                onSelect={() => {
                  onChange(parcel.id, parcel)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === parcel.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{parcel.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {parcel.length}x{parcel.width}x{parcel.depth} {parcel.length_unit.toLowerCase()}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 