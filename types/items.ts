export type ItemImage = {
  url: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  position?: 'front' | 'back' | number
}

export type Item = {
  id: string
  org_id: string
  name: string
  description?: string
  sku: string
  type: string
  price: string | null
  global_identifier?: string
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  metadata?: Record<string, any>
  notes?: string
  unit_of_measure: string
  weight: string | null
  weight_unit?: 'OUNCE' | 'POUND'
  length: string | null
  length_unit?: 'INCH' | 'CENTIMETER' | 'FOOT'
  width: string | null
  width_unit?: 'INCH' | 'CENTIMETER' | 'FOOT'
  depth: string | null
  depth_unit?: 'INCH' | 'CENTIMETER' | 'FOOT'
  tags?: string[]
  createdAt: Date
  updatedAt: Date
  front_image_url?: string
  back_image_url?: string
  images?: ItemImage[]
  inventory_quantity: number
  low_stock_alert?: number
  
  // Relations (optional since they might not always be included)
  inventory_movements?: InventoryMovement[]
  TransactionItems?: TransactionItem[]
}

export type InventoryMovement = {
  id: string
  item_id: string
  quantity_change: number
  reason: string
  reference_id?: string
  created_at: Date
  
  // Relations
  item?: Item
}

export type TransactionItem = {
  id: string
  transaction_id: string
  item_id: string
  quantity: number
  price_level?: string
  unit_price: number
  discount?: number
  total: number
  
  // Relations
  transaction?: Transaction
  item?: Item
}



// Adding these types to support the relations
export type Transaction = {
  id: string
  number: string
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELED'
  // ... other transaction fields as needed
}

