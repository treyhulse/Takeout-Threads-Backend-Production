"use server"

import prisma from "@/utils/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import dns from 'dns'
import { promisify } from 'util'
import { revalidatePath } from "next/cache"

const resolveTxt = promisify(dns.resolveTxt)

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

export async function updateDomain(storeId: string, domain: string | null) {
  try {
    const store = await prisma.store.update({
      where: { id: storeId },
      data: { 
        domain,
        domain_verified: false,
        verification_code: domain ? crypto.randomUUID() : null
      }
    })
    
    revalidatePath(`/dashboard/stores/${storeId}/settings/domains`)
    return { data: store, error: null }
  } catch (error) {
    console.error('Error updating domain:', error)
    return { data: null, error: 'Failed to update domain' }
  }
}

export async function verifyDomain(storeId: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId }
    })

    if (!store?.domain || !store.verification_code) {
      console.log('❌ Verification failed: Missing domain or verification code', { store })
      return { data: null, error: 'No domain or verification code found' }
    }

    // Clean the domain
    const cleanDomain = store.domain
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .replace(/\/$/, '')
    
    console.log('🔍 Attempting to verify domain:', {
      originalDomain: store.domain,
      cleanDomain,
      verificationCode: store.verification_code,
      expectedTxtRecord: `takeout-threads-verify=${store.verification_code}`
    })

    try {
      console.log('📡 Resolving TXT records for domain:', cleanDomain)
      const txtRecords = await resolveTxt(cleanDomain)
      console.log('📥 Received TXT records:', JSON.stringify(txtRecords, null, 2))

      const verificationRecord = txtRecords.flat().find(record => 
        record === `takeout-threads-verify=${store.verification_code}`
      )

      if (!verificationRecord) {
        console.log('❌ Verification record not found in TXT records')
        return { 
          data: null, 
          error: 'Verification record not found. Please ensure you added the TXT record correctly.' 
        }
      }

      console.log('✅ Found matching verification record:', verificationRecord)

      const updatedStore = await prisma.store.update({
        where: { id: storeId },
        data: { domain_verified: true }
      })

      console.log('✅ Domain verified successfully')
      return { data: updatedStore, error: null }
    } catch (dnsError) {
      console.error('❌ DNS resolution error:', dnsError)
      return { 
        data: null, 
        error: 'Failed to resolve DNS records. Please ensure the domain is correct.' 
      }
    }
  } catch (error) {
    console.error('❌ Domain verification error:', error)
    return { data: null, error: 'Verification process failed' }
  }
} 