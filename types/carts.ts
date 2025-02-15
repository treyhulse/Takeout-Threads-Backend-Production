import { Decimal } from '@/types/decimal'
import { CartItems } from '@/types/cartItems'
import { Customer } from '@/types/customers'
import { Address } from '@/types/addresses'
import { Discount } from '@/types/discounts'

export type CartStatus = 'ACTIVE' | 'CHECKOUT_IN_PROGRESS' | 'CONVERTED' | 'ABANDONED' | 'EXPIRED'

export interface Cart {
  id: string
  org_id: string
  customer_id?: string | null
  status: CartStatus
  total: Decimal
  tax_amount: Decimal
  shipping_cost: Decimal
  discount_total: Decimal
  total_amount: Decimal
  total_weight: Decimal
  billing_address_id?: string | null
  shipping_address_id?: string | null
  checkout_session_id?: string | null
  discount_id?: string | null
  expires_at?: Date | null
  created_at: Date
  updated_at: Date
  
  // Relations
  items?: CartItems[]
  customer?: Customer | null
  billing_address?: Address | null
  shipping_address?: Address | null
  discount?: Discount | null
}
