"use server"

import prisma from "@/utils/db"
import { ReportFormData, DashboardFormData } from "@/types/reports"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { revalidatePath } from "next/cache"
import { availableMetrics, availableDimensions } from "@/lib/utils/schema-fields"
import { baseRecordTypes } from "@/lib/utils/schema-fields"
import { Prisma } from "@prisma/client"

/**
 * Retrieves all reports for the current organization
 */
export async function getReports() {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const reports = await prisma.analyticsReport.findMany({
      where: { 
        org_id: org.orgCode 
      },
      include: {
        shared_with: true,
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return { data: reports, error: null }
  } catch (error) {
    console.error('Error fetching reports:', error)
    return { data: null, error: 'Failed to fetch reports' }
  }
}

/**
 * Creates a new report
 */
export async function createReport(data: ReportFormData) {
  try {
    const { getOrganization, getUser } = getKindeServerSession()
    const org = await getOrganization()
    const user = await getUser()
    
    if (!org?.orgCode) throw new Error("No organization found")
    if (!user?.id) throw new Error("No user found")

    // Transform the data to match Prisma schema
    const config = {
      metrics: data.config.metrics,
      dimensions: data.config.dimensions,
      filters: data.config.filters || [],
      visualization: {
        type: data.type.toLowerCase().replace('_chart', ''),
        options: data.config.visualization?.options || {},
      },
      base_record: data.base_record,
    }

    const reportData: Prisma.AnalyticsReportCreateInput = {
      name: data.name,
      description: data.description || null,
      type: data.type,
      is_public: data.is_public,
      is_favorite: false,
      config: config as any,
      org_id: org.orgCode,
      user_id: user.id,
    }

    const report = await prisma.analyticsReport.create({
      data: reportData
    })

    revalidatePath('/dashboard/analytics')
    return { data: report, error: null }
  } catch (error) {
    console.error('Error creating report:', error)
    let errorMessage = 'Failed to create report'
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        errorMessage = 'A report with this name already exists'
      } else if (error.message.includes('Foreign key constraint')) {
        errorMessage = 'Invalid organization or user reference'
      } else if (error.message.includes('Validation')) {
        errorMessage = 'Invalid report data provided'
      }
    }
    
    return { data: null, error: errorMessage }
  }
}

/**
 * Updates an existing report
 */
export async function updateReport(id: string, data: Partial<ReportFormData>) {
  try {
    const { getOrganization, getUser } = getKindeServerSession()
    const org = await getOrganization()
    const user = await getUser()
    
    if (!org?.orgCode) throw new Error("No organization found")
    if (!user?.id) throw new Error("No user found")

    // Transform the data to match Prisma schema
    const updateData: Prisma.AnalyticsReportUpdateInput = {
      name: data.name,
      description: data.description,
      type: data.type,
      is_public: data.is_public,
      config: data.config ? {
        metrics: data.config.metrics,
        dimensions: data.config.dimensions,
        filters: data.config.filters || [],
        visualization: {
          type: data.type?.toLowerCase().replace('_chart', ''),
          options: data.config.visualization?.options || {},
        },
        base_record: data.base_record,
      } as Prisma.JsonObject : undefined,
    }

    const report = await prisma.analyticsReport.update({
      where: { 
        id,
        org_id: org.orgCode,
      },
      data: updateData
    })

    revalidatePath('/dashboard/analytics')
    return { data: report, error: null }
  } catch (error) {
    console.error('Error updating report:', error)
    return { data: null, error: 'Failed to update report' }
  }
}

/**
 * Deletes a report
 */
export async function deleteReport(id: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    await prisma.analyticsReport.delete({
      where: { 
        id,
        org_id: org.orgCode
      }
    })

    revalidatePath('/dashboard/analytics')
    return { error: null }
  } catch (error) {
    console.error('Error deleting report:', error)
    return { error: 'Failed to delete report' }
  }
}

/**
 * Creates a new dashboard
 */
export async function createDashboard(data: DashboardFormData) {
  try {
    const { getOrganization, getUser } = getKindeServerSession()
    const org = await getOrganization()
    const user = await getUser()
    
    if (!org?.orgCode) throw new Error("No organization found")
    if (!user?.id) throw new Error("No user found")

    const dashboard = await prisma.dashboard.create({
      data: {
        ...data,
        org_id: org.orgCode,
        user_id: user.id,
      }
    })

    revalidatePath('/dashboard/analytics')
    return { data: dashboard, error: null }
  } catch (error) {
    console.error('Error creating dashboard:', error)
    return { data: null, error: 'Failed to create dashboard' }
  }
}

/**
 * Updates an existing dashboard
 */
export async function updateDashboard(id: string, data: Partial<DashboardFormData>) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const dashboard = await prisma.dashboard.update({
      where: { 
        id,
        org_id: org.orgCode
      },
      data
    })

    revalidatePath('/dashboard/analytics')
    return { data: dashboard, error: null }
  } catch (error) {
    console.error('Error updating dashboard:', error)
    return { data: null, error: 'Failed to update dashboard' }
  }
}

/**
 * Deletes a dashboard
 */
export async function deleteDashboard(id: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    await prisma.dashboard.delete({
      where: { 
        id,
        org_id: org.orgCode
      }
    })

    revalidatePath('/dashboard/analytics')
    return { error: null }
  } catch (error) {
    console.error('Error deleting dashboard:', error)
    return { error: 'Failed to delete dashboard' }
  }
}

/**
 * Executes a report and returns the data
 */
export async function executeReport(reportId: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    // Get the report configuration
    const report = await prisma.analyticsReport.findFirst({
      where: { 
        id: reportId,
        org_id: org.orgCode 
      }
    })

    if (!report) throw new Error("Report not found")

    const config = report.config as any
    const baseRecordType = baseRecordTypes.find(r => r.id === config.base_record)
    
    if (!baseRecordType) throw new Error("Base record type not found")

    const metrics: string[] = config.metrics || []
    const dimensions: string[] = config.dimensions || []
    const filters: any[] = config.filters || []

    if (metrics.length === 0) throw new Error("No metrics selected")
    if (dimensions.length === 0) throw new Error("No dimensions selected")

    // Build the query dynamically based on metrics and dimensions
    let query = 'SELECT '

    // Add dimensions to SELECT
    const dimensionFields = dimensions.map(d => {
      // Check if dimension is from base record
      const baseDimension = baseRecordType.dimensions.find(dim => dim.id === d)
      if (baseDimension) {
        const fields = baseDimension.field.split(',')
        if (fields.length > 1) {
          // Handle concatenated fields
          return `CONCAT(${fields.map(f => `"${baseDimension.table}".${f}`).join(", ' ', ")}) as "${baseDimension.id}"`
        }
        return `"${baseDimension.table}".${baseDimension.field} as "${baseDimension.id}"`
      }
      
      // Check if dimension is from relations
      for (const relation of baseRecordType.relations) {
        const relationDimension = relation.dimensions.find(dim => dim.id === d)
        if (relationDimension) {
          const fields = relationDimension.field.split(',')
          if (fields.length > 1) {
            // Handle concatenated fields
            return `CONCAT(${fields.map(f => `"${relationDimension.table}".${f}`).join(", ' ', ")}) as "${relationDimension.id}"`
          }
          return `"${relationDimension.table}".${relationDimension.field} as "${relationDimension.id}"`
        }
      }
      return null
    }).filter(Boolean)

    // Add metrics to SELECT
    const metricFields = metrics.map(m => {
      // Check if metric is from base record
      const baseMetric = baseRecordType.metrics.find(met => met.id === m)
      if (baseMetric) {
        return `${baseMetric.aggregation}("${baseMetric.table}".${baseMetric.id}) as "${baseMetric.id}"`
      }
      
      // Check if metric is from relations
      for (const relation of baseRecordType.relations) {
        const relationMetric = relation.metrics.find(met => met.id === m)
        if (relationMetric) {
          return `${relationMetric.aggregation}("${relationMetric.table}".${relationMetric.id}) as "${relationMetric.id}"`
        }
      }
      return null
    }).filter(Boolean)

    query += [...dimensionFields, ...metricFields].join(', ')

    // Add FROM clause with base table
    query += ` FROM "${baseRecordType.table}"`

    // Add JOINs for relations
    const usedRelations = new Set()
    for (const relation of baseRecordType.relations) {
      const hasMetric = metrics.some(m => relation.metrics.find(met => met.id === m))
      const hasDimension = dimensions.some(d => relation.dimensions.find(dim => dim.id === d))
      
      if (hasMetric || hasDimension) {
        usedRelations.add(relation.table)
        if (relation.joinThrough) {
          query += ` LEFT JOIN "${relation.joinThrough}" ON "${baseRecordType.table}".id = "${relation.joinThrough}".${baseRecordType.table.toLowerCase()}_id`
          query += ` LEFT JOIN "${relation.table}" ON "${relation.joinThrough}".${relation.table.toLowerCase()}_id = "${relation.table}".id`
        } else {
          query += ` LEFT JOIN "${relation.table}" ON "${baseRecordType.table}".${relation.joinField} = "${relation.table}".id`
        }
      }
    }

    // Add WHERE clause for organization and filters
    query += ` WHERE "${baseRecordType.table}".org_id = '${org.orgCode}'`

    if (filters.length > 0) {
      for (const filter of filters) {
        const { field, operator, value } = filter
        // Find the table for this field
        let table = baseRecordType.table
        let fieldName = field
        
        // Check if field is from relations
        for (const relation of baseRecordType.relations) {
          if (usedRelations.has(relation.table)) {
            const relationDimension = relation.dimensions.find(f => f.id === field)
            const relationMetric = relation.metrics.find(f => f.id === field)
            if (relationDimension) {
              table = relation.table
              fieldName = relationDimension.field
              break
            } else if (relationMetric) {
              table = relation.table
              fieldName = relationMetric.id
              break
            }
          }
        }

        // Add filter condition
        switch (operator) {
          case 'equals':
            query += ` AND "${table}".${fieldName} = '${value}'`
            break
          case 'contains':
            query += ` AND "${table}".${fieldName} LIKE '%${value}%'`
            break
          case 'greater_than':
            query += ` AND "${table}".${fieldName} > ${value}`
            break
          case 'less_than':
            query += ` AND "${table}".${fieldName} < ${value}`
            break
          // Add more operators as needed
        }
      }
    }

    // Add GROUP BY for dimensions
    if (dimensionFields.length > 0) {
      query += ` GROUP BY ${dimensions.map(d => {
        const baseDimension = baseRecordType.dimensions.find(dim => dim.id === d)
        if (baseDimension) {
          const fields = baseDimension.field.split(',')
          return fields.map(f => `"${baseDimension.table}".${f}`).join(', ')
        }
        
        for (const relation of baseRecordType.relations) {
          const relationDimension = relation.dimensions.find(dim => dim.id === d)
          if (relationDimension) {
            const fields = relationDimension.field.split(',')
            return fields.map(f => `"${relationDimension.table}".${f}`).join(', ')
          }
        }
        return null
      }).filter(Boolean).join(', ')}`
    }

    // Add ORDER BY for date dimensions if present
    const dateDimension = dimensions.find(d => d.includes('date') || d.includes('created_at'))
    if (dateDimension) {
      query += ` ORDER BY "${dateDimension}" ASC`
    }

    console.log('Executing query:', query) // For debugging

    // Execute the query
    const result = await prisma.$queryRawUnsafe<Record<string, any>[]>(query.trim().replace(/\s+/g, ' '))

    // Transform the results to handle decimal values
    const transformedResult = result.map((row) => {
      const transformed: Record<string, any> = {}
      for (const key in row) {
        if (typeof row[key] === 'bigint') {
          transformed[key] = Number(row[key])
        } else if (row[key] instanceof Prisma.Decimal) {
          transformed[key] = row[key].toNumber()
        } else {
          transformed[key] = row[key]
        }
      }
      return transformed
    })

    // Update last run time
    await prisma.analyticsReport.update({
      where: { id: reportId },
      data: { last_run_at: new Date() }
    })

    return { data: transformedResult, error: null }
  } catch (error) {
    console.error('Error executing report:', error)
    return { data: null, error: String(error) }
  }
} 