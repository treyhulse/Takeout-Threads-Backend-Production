"use client";

import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCustomerAddresses } from "@/lib/supabase/addresses";
import { getCustomers } from "@/lib/supabase/customers";

type Address = {
  address_id: string;
  name: string | null;
  street1: string;
  street2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  customer_id: string;
};

type Customer = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  email: string;
};

interface AddressSelectProps {
  onAddressSelect: (address: Address) => void;
}

export function AddressSelect({ onAddressSelect }: AddressSelectProps) {
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [customers, setCustomers] = useState<Record<string, Customer>>({});
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch customers first
        const customersResult = await getCustomers();
        if (customersResult.data) {
          const customersMap = customersResult.data.reduce((acc, customer) => {
            acc[customer.id] = customer;
            return acc;
          }, {} as Record<string, Customer>);
          setCustomers(customersMap);

          // Fetch addresses for all customers
          const addressPromises = customersResult.data.map(customer => 
            getCustomerAddresses(customer.id)
          );
          const addressesResults = await Promise.all(addressPromises);
          
          const allAddresses = addressesResults.flatMap(result => 
            result.data || []
          );
          setAddresses(allAddresses);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    }

    fetchData();
  }, []);

  const getAddressDisplay = (address: Address) => {
    const customer = customers[address.customer_id];
    const customerName = customer?.company_name || 
      `${customer?.first_name || ''} ${customer?.last_name || ''}`.trim();
    
    return `${address.name || customerName} - ${address.street1}, ${address.city}, ${address.state} ${address.zip}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {searchValue || "Select an address..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search addresses..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty>No address found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {addresses.map((address) => (
              <CommandItem
                key={address.address_id}
                value={getAddressDisplay(address)}
                onSelect={() => {
                  onAddressSelect(address);
                  setSearchValue(getAddressDisplay(address));
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    searchValue === getAddressDisplay(address) ? "opacity-100" : "opacity-0"
                  )}
                />
                {getAddressDisplay(address)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 