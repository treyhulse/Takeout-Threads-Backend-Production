"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAddress } from "@/lib/supabase/addresses";
import { getCustomers } from "@/lib/supabase/customers";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateAddressPayload } from "@/types/addresses";

type Customer = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  email: string;
};

type FormData = {
  name: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
  email: string;
};

export function AddressModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const result = await getCustomers();
        if (result.error) throw new Error(result.error);
        if (result.data) setCustomers(result.data);
      } catch (error) {
        toast.error("Failed to fetch customers");
      }
    }

    if (open) {
      fetchCustomers();
    }
  }, [open]);

  const onSubmit = async (data: FormData) => {
    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return;
    }

    try {
      setLoading(true);
      const addressData: CreateAddressPayload = {
        customer_id: selectedCustomer,
        name: data.name || null,
        street1: data.street1,
        street2: data.street2 || null,
        city: data.city,
        state: data.state,
        country: data.country,
        zip: data.zip,
      };

      const result = await createAddress(addressData);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Address created successfully");
      reset();
      setSelectedCustomer("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create address");
    } finally {
      setLoading(false);
    }
  };

  const getCustomerDisplayName = (customer: Customer) => {
    if (customer.company_name) {
      return `${customer.company_name} (${customer.email})`;
    }
    return `${customer.first_name || ''} ${customer.last_name || ''} (${customer.email})`.trim();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Address</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Select Customer</Label>
            <Select
              value={selectedCustomer}
              onValueChange={setSelectedCustomer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {getCustomerDisplayName(customer)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Address Name</Label>
            <Input id="name" {...register("name")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street1">Street Address</Label>
            <Input id="street1" {...register("street1", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street2">Apartment, suite, etc.</Label>
            <Input id="street2" {...register("street2")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state", { required: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP / Postal code</Label>
              <Input id="zip" {...register("zip", { required: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !selectedCustomer}
          >
            {loading ? "Creating..." : "Create Address"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 