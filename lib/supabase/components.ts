"use server"

import prisma from "@/utils/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { revalidatePath } from "next/cache"
import { ComponentData } from "@/types/editor"

/**
 * Creates a new component
 */
export async function createComponent(data: {
  name: string;
  metadata: Record<string, any>;
}) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const component = await prisma.component.create({
      data: {
        org_id: org.orgCode,
        name: data.name,
        metadata: data.metadata
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

export async function getComponent(id: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const component = await prisma.component.findFirst({
      where: { 
        id,
        org_id: org.orgCode 
      }
    })

    if (!component) throw new Error("Component not found")

    return { data: component, error: null }
  } catch (error) {
    console.error('Error fetching component:', error)
    return { data: null, error: 'Failed to fetch component' }
  }
}

export async function updateComponent(id: string, data: {
  name?: string;
  metadata?: Record<string, any>;
}) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const component = await prisma.component.update({
      where: { 
        id,
        org_id: org.orgCode 
      },
      data
    })

    revalidatePath('/dashboard/components')
    return { data: component, error: null }
  } catch (error) {
    console.error('Error updating component:', error)
    return { data: null, error: 'Failed to update component' }
  }
}

export async function deleteComponent(id: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    await prisma.component.delete({
      where: { 
        id,
        org_id: org.orgCode 
      }
    })

    revalidatePath('/dashboard/components')
    return { error: null }
  } catch (error) {
    console.error('Error deleting component:', error)
    return { error: 'Failed to delete component' }
  }
} 