import { ReportType as PrismaReportType } from "@prisma/client"

export type ReportType = PrismaReportType
export type ReportPermission = 'VIEW' | 'EDIT' | 'ADMIN'

export interface Metric {
  id: string
  label: string
  table: string
  aggregation: "sum" | "avg" | "count" | "min" | "max"
}

export interface Dimension {
  id: string
  label: string
  table: string
  field: string
}

export interface ReportConfig {
  metrics: string[]
  dimensions: string[]
  filters: Array<{
    field: string
    operator: string
    value: string | number | boolean
  }>
  visualization: {
    type: "bar" | "line" | "pie"
    options?: Record<string, any>
  }
}

export interface ReportFormData {
  name: string
  description: string
  type: ReportType
  is_public: boolean
  base_record: string
  config: ReportConfig
}

export interface DashboardFormData {
  name: string
  description?: string
  layout: Record<string, any>
  is_public: boolean
  is_favorite?: boolean
}

export interface ReportSharingData {
  report_id: string
  shared_with: string
  permissions: ReportPermission
}

export interface DashboardSharingData {
  dashboard_id: string
  shared_with: string
  permissions: ReportPermission
}

export interface Relation {
  table: string
  joinField: string
  joinThrough?: string
  metrics: Metric[]
  dimensions: Dimension[]
}

export interface BaseRecordType {
  id: string
  label: string
  table: string
  metrics: Metric[]
  dimensions: Dimension[]
  relations: Relation[]
} 