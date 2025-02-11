"use server"

import prisma from "@/utils/db"
import { Customer, CustomerFormData } from "@/types/customers"
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
      }
    })

    if (!customer) throw new Error("Customer not found")

    return { data: customer, error: null }
  } catch (error) {
    console.error('Error fetching customer:', error)
    return { data: null, error: 'Failed to fetch customer' }
  }
}

/**
 * Generates a unique customer ID
 */
async function generateCustomerId(orgId: string) {
  const count = await prisma.customers.count({
    where: { org_id: orgId }
  })
  
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
 * Deletes a customer
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