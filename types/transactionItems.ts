import { Prisma } from "@prisma/client"
import { Item } from "./items"
import { Decimal } from "@prisma/client/runtime/library"

export interface TransactionItemWithDetails {
  id: string
  transaction_id: string
  item_id: string
  quantity: number
  price_level: string | null
  unit_price: Decimal
  discount: Decimal | null
  total: Decimal
  item: {
    id: string
    name: string
    sku: string
    unit_of_measure: string
  }
}

export type TransactionItemCreateInput = {
  item_id: string
  quantity: number
  unit_price: number
  price_level?: string | null
  discount?: number | null
  total: number
}

export type TransactionItemUpdateInput = Partial<TransactionItemCreateInput>