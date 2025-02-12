"use server"

import prisma from "@/utils/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function getStores() {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const stores = await prisma.store.findMany({
      where: { 
        org_id: org.orgCode 
      },
      include: {
        theme: true,
        pages: true,
      },
      orderBy: {
        name: 'asc'
      }
    })
    return { data: stores, error: null }
  } catch (error) {
    console.error('Error fetching stores:', error)
    return { data: null, error: 'Failed to fetch stores' }
  }
}

/**
 * Retrieves a single store by ID
 */
export async function getStore(id: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const store = await prisma.store.findFirst({
      where: { 
        id,
        org_id: org.orgCode 
      },
      include: {
        theme: true,
        pages: true,
      }
    })

    if (!store) throw new Error("Store not found")

    return { data: store, error: null }
  } catch (error) {
    console.error('Error fetching store:', error)
    return { data: null, error: 'Failed to fetch store' }
  }
}

export async function createStore(data: {
  name: string
  subdomain: string
  slogan?: string
}) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const store = await prisma.store.create({
      data: {
        org_id: org.orgCode,
        name: data.name,
        subdomain: data.subdomain,
        slogan: data.slogan,
      },
    })

    return { data: store, error: null }
  } catch (error) {
    console.error('Error creating store:', error)
    return { data: null, error: 'Failed to create store' }
  }
}

export async function updateStore(id: string, data: {
  name?: string
  subdomain?: string
  slogan?: string
  store_logo_url?: string | null
}) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const store = await prisma.store.update({
      where: { 
        id,
        org_id: org.orgCode 
      },
      data
    })

    return { data: store, error: null }
  } catch (error) {
    console.error('Error updating store:', error)
    return { data: null, error: 'Failed to update store' }
  }
}

export async function createInitialStore(orgId: string, orgName: string) {
  try {
    const store = await prisma.store.create({
      data: {
        org_id: orgId,
        name: orgName,
        subdomain: orgName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, ''),
        slogan: `Welcome to ${orgName}!`,
      }
    })

    return { data: store, error: null }
  } catch (error) {
    console.error('Error creating initial store:', error)
    return { data: null, error: 'Failed to create initial store' }
  }
} 