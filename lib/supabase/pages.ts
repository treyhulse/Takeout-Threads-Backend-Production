"use server"

import prisma from "@/utils/db"
import { CreatePageParams } from "@/types/pages"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { revalidatePath } from "next/cache"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function getUniqueSlug(storeId: string, baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 0
  let isUnique = false

  while (!isUnique) {
    const existingPage = await prisma.page.findFirst({
      where: { store_id: storeId, slug }
    })
    
    if (!existingPage) {
      isUnique = true
    } else {
      counter++
      slug = `${baseSlug}-${counter}`
    }
  }

  return slug
}

/**
 * Creates a new page
 */
export async function createPage(params: CreatePageParams) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const baseSlug = generateSlug(params.name)
    const slug = await getUniqueSlug(params.store_id, baseSlug)

    const page = await prisma.page.create({
      data: {
        store_id: params.store_id,
        org_id: org.orgCode,
        name: params.name,
        slug,
        metadata: params.metadata || { layout: [] }
      }
    })

    revalidatePath(`/dashboard/stores/${params.store_id}`)
    return { data: page, error: null }
  } catch (error) {
    console.error('Error creating page:', error)
    return { data: null, error: 'Failed to create page' }
  }
}

/**
 * Retrieves all pages for a store
 */
export async function getPages(storeId: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const pages = await prisma.page.findMany({
      where: { 
        store_id: storeId,
        org_id: org.orgCode 
      },
      orderBy: {
        name: 'asc'
      }
    })

    return { data: pages, error: null }
  } catch (error) {
    console.error('Error fetching pages:', error)
    return { data: null, error: 'Failed to fetch pages' }
  }
}

/**
 * Retrieves a single page by ID
 */
export async function getPage(pageId: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const page = await prisma.page.findFirst({
      where: { 
        id: pageId,
        org_id: org.orgCode 
      }
    })

    if (!page) throw new Error("Page not found")

    return { data: page, error: null }
  } catch (error) {
    console.error('Error fetching page:', error)
    return { data: null, error: 'Failed to fetch page' }
  }
}

/**
 * Updates a page's metadata
 */
export async function updatePage(pageId: string, metadata: any) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const page = await prisma.page.update({
      where: { 
        id: pageId,
        org_id: org.orgCode 
      },
      data: { metadata }
    })

    revalidatePath(`/dashboard/stores/${page.store_id}/pages/${page.id}`)
    return { data: page, error: null }
  } catch (error) {
    console.error('Error updating page:', error)
    return { data: null, error: 'Failed to update page' }
  }
} 