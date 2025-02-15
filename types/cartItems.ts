import { Decimal } from '@/types/decimal'
import { Cart } from '@/types/carts'
import { Item } from '@/types/items'

export interface CartItems {
  id: string
  cart_id: string
  item_id: string
  quantity: number
  unit_price: Decimal
  total: Decimal
  
  // Relations
  cart?: Cart
  item?: Item
}
