export type Address = {
  id: string
  org_id: string
  customer_id: string
  address_id: string
  easypost_id?: string | null
  name?: string | null
  company?: string | null
  street1: string
  street2?: string | null
  city: string
  state: string
  country: string
  zip: string
  phone?: string | null
  email?: string | null
  valid: boolean
  coordinates?: string | null
  created_at: Date | null
  updated_at: Date | null
}

// New type for creating addresses
export type AddressCreate = {
  name?: string | null
  company?: string | null
  street1: string
  street2?: string | null
  city: string
  state: string
  country: string
  zip: string
  phone?: string | null
  email?: string | null
  valid?: boolean
  coordinates?: string | null
}

export interface VerificationResult {
  verified: boolean
  suggestions: Address[]
  error?: string
} 