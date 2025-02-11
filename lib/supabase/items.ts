"use server"

import prisma from "@/utils/db"
import { Item } from "@/types/items"
import { revalidatePath } from "next/cache"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { DimensionUnit, WeightUnit } from "@prisma/client"

export async function getItems() {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const items = await prisma.items.findMany({
      where: {
        org_id: org.orgCode
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return { data: items, error: null }
  } catch (error) {
    console.error('Error fetching items:', error)
    return { data: null, error: 'Failed to fetch items' }
  }
}

export async function createItem(data: Partial<Item>) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const itemData = {
      name: data.name!,
      sku: data.sku!,
      type: data.type!,
      unit_of_measure: data.unit_of_measure!,
      description: data.description,
      status: data.status || 'DRAFT',
      org_id: org.orgCode,
      ...(data.weight && { weight: data.weight }),
      ...(data.weight_unit && { weight_unit: data.weight_unit as WeightUnit }),
      ...(data.length_unit && { length_unit: data.length_unit as DimensionUnit }),
      ...(data.width_unit && { width_unit: data.width_unit as DimensionUnit }),
      ...(data.depth_unit && { depth_unit: data.depth_unit as DimensionUnit }),
    }

    const item = await prisma.items.create({
      data: itemData,
    })
    revalidatePath('/dashboard/products')
    return { data: item, error: null }
  } catch (error) {
    console.error('Error creating item:', error)
    return { data: null, error: 'Failed to create item' }
  }
}

export async function updateItem(id: string, data: Partial<Item>) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    // Only include defined fields in the update
    const updateData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    const item = await prisma.items.update({
      where: { 
        id,
        org_id: org.orgCode
      },
      data: updateData,
    })
    revalidatePath('/dashboard/products')
    return { data: item, error: null }
  } catch (error) {
    console.error('Error updating item:', error)
    return { data: null, error: 'Failed to update item' }
  }
}

export async function deleteItem(id: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    await prisma.items.delete({
      where: { 
        id,
        org_id: org.orgCode // Ensure users can only delete their org's items
      },
    })
    revalidatePath('/dashboard/products')
    return { error: null }
  } catch (error) {
    console.error('Error deleting item:', error)
    return { error: 'Failed to delete item' }
  }
}

export async function getItemById(id: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const item = await prisma.items.findUnique({
      where: { 
        id,
        org_id: org.orgCode // Ensure users can only view their org's items
      },
    })
    return { data: item, error: null }
  } catch (error) {
    console.error('Error fetching item:', error)
    return { data: null, error: 'Failed to fetch item' }
  }
}
