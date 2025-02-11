"use server"

import prisma from "@/utils/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { revalidatePath } from "next/cache"
import { Address, AddressCreate } from "@/types/addresses"

/**
 * Creates a new address for a customer
 */
export async function createAddress(customerId: string, addressData: AddressCreate) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const address = await prisma.addresses.create({
      data: {
        ...addressData,
        org_id: org.orgCode,
        customer_id: customerId,
        address_id: crypto.randomUUID(),
        verified: addressData.verified ?? false,
      }
    })

    revalidatePath('/dashboard/customers/[customerId]', 'page')
    return { data: address, error: null }
  } catch (error) {
    console.error('Error creating address:', error)
    return { data: null, error: 'Failed to create address' }
  }
}

/**
 * Retrieves all addresses for a customer
 */
export async function getCustomerAddresses(customerId: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const addresses = await prisma.addresses.findMany({
      where: {
        org_id: org.orgCode,
        customer_id: customerId,
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return { data: addresses, error: null }
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return { data: null, error: 'Failed to fetch addresses' }
  }
}

/**
 * Retrieves a single address by ID
 */
export async function getAddress(addressId: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const address = await prisma.addresses.findFirst({
      where: {
        address_id: addressId,
        org_id: org.orgCode,
      }
    })

    if (!address) {
      return { data: null, error: 'Address not found' }
    }

    return { data: address, error: null }
  } catch (error) {
    console.error('Error fetching address:', error)
    return { data: null, error: 'Failed to fetch address' }
  }
}

/**
 * Updates an existing address
 */
export async function updateAddress(addressId: string, addressData: Partial<Address>) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const address = await prisma.addresses.update({
      where: {
        address_id: addressId,
        org_id: org.orgCode,
      },
      data: addressData,
    })

    revalidatePath('/dashboard/customers/[customerId]', 'page')
    return { data: address, error: null }
  } catch (error) {
    console.error('Error updating address:', error)
    return { data: null, error: 'Failed to update address' }
  }
}

/**
 * Deletes an address
 */
export async function deleteAddress(addressId: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    // First, remove any default address references
    await prisma.customers.updateMany({
      where: {
        OR: [
          { default_shipping_address: addressId },
          { default_billing_address: addressId }
        ],
        org_id: org.orgCode,
      },
      data: {
        default_shipping_address: null,
        default_billing_address: null,
      }
    })

    // Then delete the address
    await prisma.addresses.delete({
      where: {
        address_id: addressId,
        org_id: org.orgCode,
      }
    })

    revalidatePath('/dashboard/customers/[customerId]', 'page')
    return { error: null }
  } catch (error) {
    console.error('Error deleting address:', error)
    return { error: 'Failed to delete address' }
  }
}

/**
 * Sets an address as the default shipping or billing address for a customer
 */
export async function setDefaultAddress(
  customerId: string,
  addressId: string,
  type: 'shipping' | 'billing'
) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const updateData = type === 'shipping'
      ? { default_shipping_address: addressId }
      : { default_billing_address: addressId }

    const customer = await prisma.customers.update({
      where: {
        id: customerId,
        org_id: org.orgCode,
      },
      data: updateData,
    })

    revalidatePath('/dashboard/customers/[customerId]', 'page')
    return { data: customer, error: null }
  } catch (error) {
    console.error('Error setting default address:', error)
    return { data: null, error: 'Failed to set default address' }
  }
} 