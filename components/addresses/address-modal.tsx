import { getCustomers } from "@/lib/supabase/customers";
import { AddressModalWrapper } from "./address-modal-wrapper";

export async function AddressModal() {
  const { data: customers, error } = await getCustomers();

  if (error) {
    throw new Error('Failed to fetch customers');
  }

  return <AddressModalWrapper customers={customers} />;
} 