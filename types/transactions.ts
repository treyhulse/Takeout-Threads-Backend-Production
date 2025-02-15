import { Address } from "@/types/addresses"
import { 
  PaymentMethod, 
  PaymentStatus, 
  TransactionType, 
  TransactionStatus,
  ShipmentStatus
} from "@prisma/client"

export interface Shipment {
  id: string
  transaction_id: string
  carrier: string
  tracking_number: string
  status: ShipmentStatus
  shipped_at: Date | null
  delivered_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface TransactionItem {
  id: string
  transaction_id: string
  item_id: string
  quantity: number
  price_level: string | null
  unit_price: number
  discount: number | null
  total: number
  created_at: Date
  item: {
    id: string
    name: string
    sku: string
    unit_of_measure: string
  }
}

export interface Transaction {
  id: string
  number: string
  org_id: string
  entity_id: string | null
  type: TransactionType
  status: TransactionStatus
  total: number
  tax_amount: number
  shipping_cost: number
  discount_total: number
  total_amount: number
  payment_status: PaymentStatus
  payment_method: PaymentMethod | null
  shipping_method: string | null
  estimated_ship_date: Date | null
  actual_ship_date: Date | null
  billing_address_id: string | null
  shipping_address_id: string | null
  discount_id: string | null
  tax: number | null
  created_at: Date
  updated_at: Date
  items: TransactionItem[]
  customer: {
    id: string
    customer_id: string
    first_name: string | null
    last_name: string | null
    company_name: string | null
    email: string
  } | null
  billing_address: Address | null
  shipping_address: Address | null
  shipments: Shipment[]
}

export type TransactionCreateInput = {
  type: TransactionType
  entity_id?: string | null
  total: number
  tax?: number | null
  shipping?: number | null
  shipping_method?: string | null
  billing_address_id?: string | null
  shipping_address_id?: string | null
  discount_id?: string | null
  items: {
    item_id: string
    quantity: number
    unit_price: number
    price_level?: string | null
    discount?: number | null
    total: number
  }[]
}

export type TransactionUpdateInput = {
  entity_id?: string | null
  status?: TransactionStatus
  payment_status?: PaymentStatus
  payment_method?: PaymentMethod | null
  shipping_method?: string | null
  estimated_ship_date?: Date | null
  actual_ship_date?: Date | null
  billing_address_id?: string | null
  shipping_address_id?: string | null
  discount_id?: string | null
  tax?: number | null
}
