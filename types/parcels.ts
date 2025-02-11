import { DimensionUnit, WeightUnit } from "@prisma/client"

export interface Parcel {
  id: string
  org_id: string
  name: string
  description: string
  length: number
  length_unit: DimensionUnit
  width: number
  width_unit: DimensionUnit
  depth: number
  depth_unit: DimensionUnit
  weight: number
  weight_unit: WeightUnit
  created_at: Date
  updated_at: Date
}

export type CreateParcelInput = Omit<Parcel, "id" | "created_at" | "updated_at"> 