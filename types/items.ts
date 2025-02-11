export type Item = {
  id: string
  org_id: string
  name: string
  description?: string
  sku: string
  type: string
  variations?: any
  price: string | null
  global_identifier?: string
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  metadata?: any
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
} 