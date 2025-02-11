"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { verifyAddress } from "@/lib/easypost/actions";
import { createAddress } from "@/lib/supabase/addresses";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateAddressPayload } from "@/types/addresses";

type Customer = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  email: string;
  // ... add other fields if needed
};

const addressFormSchema = z.object({
  name: z.string().optional(),
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  customer_id: z.string().min(1, "Customer is required"),
});

type FormData = z.infer<typeof addressFormSchema>;

type AddressFormProps = {
  customers: Customer[];
  onSuccess: () => void;
};

export function AddressForm({ customers, onSuccess }: AddressFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addressFormSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return;
    }

    try {
      setVerifying(true);
      setVerificationError(null);

      const verificationResult = await verifyAddress({
          street1: data.street1,
          street2: data.street2 || null,
          city: data.city,
          state: data.state,
          country: data.country,
          zip: data.zip,
          name: data.name || null,
          customer_id: ""
      });

      if (!verificationResult.success) {
        setVerificationError(verificationResult.error || 'Address verification failed');
        toast.error('Address verification failed');
        return;
      }

      setLoading(true);
      const addressData = {
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
      onSuccess();
    } catch (error) {
      toast.error("Failed to create address");
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  const getCustomerDisplayName = (customer: Customer) => {
    if (customer.company_name) {
      return `${customer.company_name} (${customer.email})`;
    }
    return `${customer.first_name || ''} ${customer.last_name || ''} (${customer.email})`.trim();
  };

  return (
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

      {/* Rest of the form fields */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
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

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || verifying || !selectedCustomer}
      >
        {verifying ? "Verifying..." : loading ? "Creating..." : "Create Address"}
      </Button>
      {verificationError && (
        <p className="text-sm text-destructive mt-2">{verificationError}</p>
      )}
    </form>
  );
} 