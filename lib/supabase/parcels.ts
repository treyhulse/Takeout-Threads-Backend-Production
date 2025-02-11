'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/utils/db'
import { CreateParcelInput } from '@/types/parcels'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function createParcel(data: Omit<CreateParcelInput, 'org_id'>) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const parcel = await prisma.parcels.create({
      data: {
        ...data,
        org_id: org.orgCode,
        // Convert string numbers to Decimal for Prisma
        length: parseFloat(data.length.toString()),
        width: parseFloat(data.width.toString()),
        depth: parseFloat(data.depth.toString()),
        weight: parseFloat(data.weight.toString()),
      },
    })

    revalidatePath('/parcels')
    return { success: true, data: parcel }
  } catch (error) {
    console.error('Error creating parcel:', error)
    return { success: false, error: 'Failed to create parcel' }
  }
}

export async function getParcels() {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const parcels = await prisma.parcels.findMany({
      where: { 
        org_id: org.orgCode 
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Convert Decimal to number for client-side use
    const formattedParcels = parcels.map(parcel => ({
      ...parcel,
      length: Number(parcel.length),
      width: Number(parcel.width),
      depth: Number(parcel.depth),
      weight: Number(parcel.weight),
    }))

    return { data: formattedParcels, error: null }
  } catch (error) {
    console.error('Error fetching parcels:', error)
    return { data: null, error: 'Failed to fetch parcels' }
  }
} 