"use server"

import prisma from "@/utils/db"
import { CreateComponentParams } from "@/types/components"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { revalidatePath } from "next/cache"

/**
 * Creates a new component
 */
export async function createComponent(params: CreateComponentParams) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const component = await prisma.component.create({
      data: {
        org_id: org.orgCode,
        name: params.name,
        metadata: params.metadata as any
      }
    })

    revalidatePath('/dashboard/components')
    return { data: component, error: null }
  } catch (error) {
    console.error('Error creating component:', error)
    return { data: null, error: 'Failed to create component' }
  }
}

/**
 * Retrieves all components for the organization
 */
export async function getComponents() {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const components = await prisma.component.findMany({
      where: { 
        org_id: org.orgCode 
      },
      orderBy: {
        name: 'asc'
      }
    })

    return { data: components, error: null }
  } catch (error) {
    console.error('Error fetching components:', error)
    return { data: null, error: 'Failed to fetch components' }
  }
} 