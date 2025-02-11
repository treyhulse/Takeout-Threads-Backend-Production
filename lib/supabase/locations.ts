'use server'

import prisma from "@/utils/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { revalidatePath } from "next/cache"

export type CreateLocationInput = {
  name: string
  description: string
  address_id: string
}

export async function createLocation(data: CreateLocationInput) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const location = await prisma.locations.create({
      data: {
        ...data,
        org_id: org.orgCode,
      },
      include: {
        address: true,
      },
    })

    revalidatePath('/dashboard/shipping')
    return { success: true, data: location }
  } catch (error) {
    console.error('Error creating location:', error)
    return { success: false, error: 'Failed to create location' }
  }
}

export async function getLocations() {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const locations = await prisma.locations.findMany({
      where: { 
        org_id: org.orgCode 
      },
      include: {
        address: true,
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return { data: locations, error: null }
  } catch (error) {
    console.error('Error fetching locations:', error)
    return { data: null, error: 'Failed to fetch locations' }
  }
} 