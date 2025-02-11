"use server"

import prisma from '@/utils/db';
import { CreateAddressPayload, UpdateAddressPayload } from '@/types/addresses';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

export async function createAddress(data: Omit<CreateAddressPayload, 'org_id'>) {
  try {
    const { getOrganization } = getKindeServerSession();
    const org = await getOrganization();
    
    if (!org?.orgCode) {
      console.error('No organization found during address creation');
      throw new Error("No organization found");
    }

    console.log('Creating address with data:', {
      ...data,
      org_id: org.orgCode,
      timestamp: new Date().toISOString()
    });

    const address = await prisma.addresses.create({
      data: {
        ...data,
        org_id: org.orgCode,
        address_id: crypto.randomUUID(),
      },
    });

    console.log('Address created successfully:', {
      address_id: address.address_id,
      customer_id: address.customer_id,
      org_id: address.org_id,
      timestamp: new Date().toISOString()
    });

    revalidatePath('/dashboard/shipping');
    return { data: address, error: null };
  } catch (error) {
    console.error('Error in createAddress:', {
      error,
      timestamp: new Date().toISOString(),
      data: {
        ...data,
        customer_id: data.customer_id,
      }
    });
    return { data: null, error: 'Failed to create address' };
  }
}

export async function getAddress(address_id: string) {
  try {
    const { getOrganization } = getKindeServerSession();
    const org = await getOrganization();
    
    if (!org?.orgCode) throw new Error("No organization found");

    console.log('Fetching address:', { address_id, org_id: org.orgCode });

    const address = await prisma.addresses.findFirst({
      where: { 
        address_id,
        org_id: org.orgCode 
      },
    });

    return { data: address, error: null };
  } catch (error) {
    console.error('Error in getAddress:', {
      error,
      address_id,
      timestamp: new Date().toISOString()
    });
    return { data: null, error: 'Failed to fetch address' };
  }
}

export async function getCustomerAddresses(customer_id: string) {
  try {
    const { getOrganization } = getKindeServerSession();
    const org = await getOrganization();
    
    if (!org?.orgCode) throw new Error("No organization found");

    console.log('Fetching customer addresses:', { 
      customer_id, 
      org_id: org.orgCode,
      timestamp: new Date().toISOString()
    });

    const addresses = await prisma.addresses.findMany({
      where: { 
        customer_id,
        org_id: org.orgCode 
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return { data: addresses, error: null };
  } catch (error) {
    console.error('Error in getCustomerAddresses:', {
      error,
      customer_id,
      timestamp: new Date().toISOString()
    });
    return { data: null, error: 'Failed to fetch customer addresses' };
  }
}

export async function updateAddress(address_id: string, data: UpdateAddressPayload) {
  try {
    const { getOrganization } = getKindeServerSession();
    const org = await getOrganization();
    
    if (!org?.orgCode) throw new Error("No organization found");

    console.log('Updating address:', {
      address_id,
      org_id: org.orgCode,
      data,
      timestamp: new Date().toISOString()
    });

    const address = await prisma.addresses.update({
      where: { 
        address_id,
        org_id: org.orgCode
      },
      data,
    });

    revalidatePath('/dashboard/shipping');
    return { data: address, error: null };
  } catch (error) {
    console.error('Error in updateAddress:', {
      error,
      address_id,
      data,
      timestamp: new Date().toISOString()
    });
    return { data: null, error: 'Failed to update address' };
  }
}

export async function deleteAddress(address_id: string) {
  try {
    const { getOrganization } = getKindeServerSession();
    const org = await getOrganization();
    
    if (!org?.orgCode) throw new Error("No organization found");

    console.log('Deleting address:', {
      address_id,
      org_id: org.orgCode,
      timestamp: new Date().toISOString()
    });

    await prisma.addresses.delete({
      where: { 
        address_id,
        org_id: org.orgCode
      },
    });

    revalidatePath('/dashboard/shipping');
    return { error: null };
  } catch (error) {
    console.error('Error in deleteAddress:', {
      error,
      address_id,
      timestamp: new Date().toISOString()
    });
    return { error: 'Failed to delete address' };
  }
} 