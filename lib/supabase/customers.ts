"use server"

import prisma from "@/utils/db"
import { CustomerFormData } from "@/types/customers"
import { Address } from "@/types/addresses"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { revalidatePath } from "next/cache"

/**
 * Retrieves all customers for the current organization
 */
export async function getCustomers() {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const customers = await prisma.customers.findMany({
      where: { 
        org_id: org.orgCode 
      },
      include: {
        addresses: true,
        shipping_address: true,
        billing_address: true,
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return { data: customers, error: null }
  } catch (error) {
    console.error('Error fetching customers:', error)
    return { data: null, error: 'Failed to fetch customers' }
  }
}

/**
 * Retrieves a single customer by ID
 */
export async function getCustomer(id: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const customer = await prisma.customers.findFirst({
      where: { 
        id,
        org_id: org.orgCode 
      },
      include: {
        addresses: true,
        shipping_address: true,
        billing_address: true,
      }
    })

    if (!customer) throw new Error("Customer not found")

    return { 
      data: customer as unknown as Customer & {
        addresses: Address[],
        shipping_address: Address | null,
        billing_address: Address | null
      }, 
      error: null 
    }
  } catch (error) {
    console.error('Error fetching customer:', error)
    return { data: null, error: 'Failed to fetch customer' }
  }
}

/**
 * Generates a unique customer ID
 */
async function generateCustomerId(orgId: string) {
  // Get the count of existing customers for this org
  const count = await prisma.customers.count({
    where: { org_id: orgId }
  })
  
  // Generate ID in format CUST-00001
  const paddedNumber = (count + 1).toString().padStart(6, '0')
  return `C-${paddedNumber}`
}

/**
 * Creates a new customer
 */
export async function createCustomer(data: Omit<CustomerFormData, 'customer_id'>) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    // Generate a unique customer ID
    const customer_id = await generateCustomerId(org.orgCode)

    const customer = await prisma.customers.create({
      data: {
        ...data,
        customer_id,
        org_id: org.orgCode,
      }
    })

    revalidatePath('/dashboard/customers')
    return { data: customer, error: null }
  } catch (error) {
    console.error('Error creating customer:', error)
    return { data: null, error: 'Failed to create customer' }
  }
}

/**
 * Updates an existing customer
 */
export async function updateCustomer(id: string, data: Partial<CustomerFormData>) {
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

    const customer = await prisma.customers.update({
      where: { 
        id,
        org_id: org.orgCode
      },
      data: updateData,
    })

    revalidatePath('/dashboard/customers')
    return { data: customer, error: null }
  } catch (error) {
    console.error('Error updating customer:', error)
    return { data: null, error: 'Failed to update customer' }
  }
}

/**
 * Deletes a customer and all associated addresses
 */
export async function deleteCustomer(id: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    await prisma.customers.delete({
      where: { 
        id,
        org_id: org.orgCode
      }
    })

    revalidatePath('/dashboard/customers')
    return { error: null }
  } catch (error) {
    console.error('Error deleting customer:', error)
    return { error: 'Failed to delete customer' }
  }
}

/**
 * Creates a new address for a customer
 */
export async function createAddress(customerId: string, data: Partial<Address>) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const address = await prisma.addresses.create({
      data: {
        ...data,
        org_id: org.orgCode,
        customer_id: customerId,
      }
    })

    revalidatePath('/dashboard/customers')
    return { data: address, error: null }
  } catch (error) {
    console.error('Error creating address:', error)
    return { data: null, error: 'Failed to create address' }
  }
}

/**
 * Updates an existing address
 */
export async function updateAddress(id: string, data: Partial<Address>) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const updateData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    const address = await prisma.addresses.update({
      where: { 
        id,
        org_id: org.orgCode
      },
      data: updateData,
    })

    revalidatePath('/dashboard/customers')
    return { data: address, error: null }
  } catch (error) {
    console.error('Error updating address:', error)
    return { data: null, error: 'Failed to update address' }
  }
}

/**
 * Deletes an address
 */
export async function deleteAddress(id: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    await prisma.addresses.delete({
      where: { 
        id,
        org_id: org.orgCode
      }
    })

    revalidatePath('/dashboard/customers')
    return { error: null }
  } catch (error) {
    console.error('Error deleting address:', error)
    return { error: 'Failed to delete address' }
  }
}

/**
 * Sets the default shipping or billing address for a customer
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
        org_id: org.orgCode
      },
      data: updateData,
    })

    revalidatePath('/dashboard/customers')
    return { data: customer, error: null }
  } catch (error) {
    console.error('Error setting default address:', error)
    return { data: null, error: 'Failed to set default address' }
  }
} 