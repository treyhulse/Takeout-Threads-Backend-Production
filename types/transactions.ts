import { TransactionStatus, TransactionType } from "@prisma/client"

export interface TransactionItem {
  id: string
  transaction_id: string
  item_id: string
  quantity: number
  price_level?: string | null
  unit_price: number
  discount?: number | null
  total: number
  item: {
    name: string
    sku: string
  }
}

export interface Transaction {
  id: string
  number: string
  org_id: string
  entity_id?: string | null
  type: TransactionType
  status: TransactionStatus
  total: number
  tax?: number | null
  shipping?: number | null
  created_at: Date
  updated_at: Date
  items: TransactionItem[]
  customer?: {
    first_name?: string | null
    last_name?: string | null
    company_name?: string | null
    email: string
  } | null
}

export type TransactionCreateInput = {
  type: TransactionType
  entity_id?: string | null
  total: number
  tax?: number | null
  shipping?: number | null
  items: {
    item_id: string
    quantity: number
    unit_price: number
    price_level?: string
    discount?: number
    total: number
  }[]
}

export type TransactionUpdateInput = Partial<TransactionCreateInput>
