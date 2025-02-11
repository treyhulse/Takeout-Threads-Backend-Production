
export type Customer = {
  id: string
  org_id: string
  customer_id: string
  first_name: string
  last_name: string
  email: string
  alt_email: string | null
  phone: string | null
  alt_phone: string | null
  company_name: string | null
  customer_category: string | null
  account_rep: string | null
  notes: string | null
  created_at: Date
  updated_at: Date
  default_shipping_address: string | null
  default_billing_address: string | null
}

export type CustomerFormData = Omit<Customer, 'id' | 'org_id' | 'created_at' | 'updated_at'>
