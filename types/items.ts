export type Item = {
  id: string
  org_id: string
  name: string
  description?: string
  sku: string
  type: string
  variations?: any
  price?: number
  global_identifier?: string
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  metadata?: any
  notes?: string
  unit_of_measure: string
  weight?: number
  weight_unit?: 'OUNCE' | 'POUND'
  length?: number
  length_unit?: 'INCH' | 'CENTIMETER' | 'FOOT'
  width?: number
  width_unit?: 'INCH' | 'CENTIMETER' | 'FOOT'
  depth?: number
  depth_unit?: 'INCH' | 'CENTIMETER' | 'FOOT'
  tags?: string[]
  createdAt: Date
  updatedAt: Date
} 