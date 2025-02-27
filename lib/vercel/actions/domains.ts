"use server"

import { getVercelAccessToken, getVercelProjectId } from '@/lib/vercel/config'
import prisma from "@/utils/db"
import dns from 'dns'
import { promisify } from 'util'
import { revalidatePath } from "next/cache"

const resolveTxt = promisify(dns.resolveTxt)

export async function addDomainToVercel(domain: string) {
  const token = await getVercelAccessToken()
  const projectId = getVercelProjectId()

  console.log('🔄 Adding domain to Vercel:', domain)

  const response = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: domain })
  })

  const data = await response.json()
  
  if (!response.ok) {
    console.error('❌ Failed to add domain to Vercel:', data)
    throw new Error(data.error?.message || 'Failed to add domain to Vercel')
  }

  console.log('✅ Domain added to Vercel:', data)
  return data
}

export async function removeDomainFromVercel(domain: string) {
  const token = await getVercelAccessToken()
  const projectId = getVercelProjectId()

  console.log('🔄 Removing domain from Vercel:', domain)

  const response = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains/${domain}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  const data = await response.json()
  
  if (!response.ok) {
    console.error('❌ Failed to remove domain from Vercel:', data)
    throw new Error(data.error?.message || 'Failed to remove domain from Vercel')
  }

  console.log('✅ Domain removed from Vercel:', data)
  return data
}

export async function verifyDomainOnVercel(domain: string) {
  const token = await getVercelAccessToken()
  const projectId = getVercelProjectId()

  // First check if domain exists
  const { configured } = await checkDomainStatus(domain)

  if (!configured) {
    // Add domain if not configured
    await addDomainToVercel(domain)
  }

  // Verify the domain
  const response = await fetch(
    `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}/verify`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to verify domain')
  }

  return data
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

      try {
        // Add domain to Vercel project
        await addDomainToVercel(cleanDomain)
      } catch (error: any) {
        // If the error is because the domain is already in use with this project,
        // we can consider this a success
        if (error.message?.includes('already in use by one of your projects')) {
          console.log('✅ Domain is already configured with this project')
          // Continue with verification
        } else {
          // For other errors, throw them to be handled
          throw error
        }
      }

      // Update store with verified domain
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
        error: dnsError instanceof Error ? dnsError.message : 'Failed to resolve DNS records. Please ensure the domain is correct.' 
      }
    }
  } catch (error) {
    console.error('❌ Domain verification error:', error)
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Verification process failed' 
    }
  }
}

export async function checkDomainStatus(domain: string): Promise<{
  configured: boolean;
  message: string;
}> {
  const token = await getVercelAccessToken()
  const projectId = getVercelProjectId()

  try {
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (response.ok) {
      return {
        configured: true,
        message: "Domain is configured in Vercel"
      }
    } else {
      return {
        configured: false,
        message: data.error?.message || "Domain is not configured in Vercel"
      }
    }
  } catch (error) {
    console.error('Failed to check domain status:', error)
    return {
      configured: false,
      message: "Failed to check domain status"
    }
  }
} 