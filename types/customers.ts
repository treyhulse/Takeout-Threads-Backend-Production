export type Customer = {
  id: string
  org_id: string
  customer_id: string
  first_name?: string
  last_name?: string
  company_name?: string
  email: string
  alt_email?: string
  phone?: string
  alt_phone?: string
  account_rep?: string
  comments?: string
  last_order_date?: Date
  customer_category?: string
  notes?: string
  default_shipping_address?: string
  default_billing_address?: string
  created_at: Date
  updated_at: Date
}

export type CustomerFormData = Omit<Customer, 'id' | 'org_id' | 'created_at' | 'updated_at'>