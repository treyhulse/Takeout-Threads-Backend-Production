import { Decimal } from '@prisma/client/runtime/library'
import { Transaction } from '@/types/transactions'

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING'

export interface Discount {
  id: string
  org_id: string
  code: string
  type: DiscountType
  value: Decimal
  starts_at: Date
  ends_at: Date | null
  usage_limit: number | null
  times_used: number
  minimum_amount: Decimal | null
  created_at: Date
  updated_at: Date
  
  // Relations
  transactions?: Transaction[]
} 