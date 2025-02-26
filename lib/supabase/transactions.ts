"use server"

import prisma from "@/utils/db"
import { TransactionCreateInput, TransactionUpdateInput } from "@/types/transactions"
import { TransactionType } from "@prisma/client"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { revalidatePath } from "next/cache"
import { Decimal } from "@prisma/client/runtime/library"

// Helper function to convert Decimal to number and handle dates
const convertDecimalToNumber = (obj: any): any => {
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== 'object') return obj
  
  if (obj instanceof Decimal) {
    return Number(obj)
  }

  if (obj instanceof Date) {
    return obj.toISOString()
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertDecimalToNumber)
  }
  
  const converted: any = {}
  for (const key in obj) {
    converted[key] = convertDecimalToNumber(obj[key])
  }
  return converted
}

export async function getTransactions() {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const transactions = await prisma.transactions.findMany({
      where: {
        org_id: org.orgCode
      },
      include: {
        items: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                sku: true,
                unit_of_measure: true
              }
            }
          }
        },
        customer: true
      }
    })

    // Convert all Decimal values to numbers
    const data = convertDecimalToNumber(transactions)
    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to fetch transactions' }
  }
}

export async function getTransactionById(id: string) {
  const transaction = await prisma.transactions.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          item: true
        }
      },
      customer: true,
      billing_address: true,
      shipping_address: true,
      shipments: true
    }
  })

  if (!transaction) return null

  // Convert all Decimal values to numbers
  return convertDecimalToNumber(transaction)
}

export async function createTransaction(data: TransactionCreateInput) {
  const { getOrganization } = getKindeServerSession()
  const org = await getOrganization()
  
  if (!org?.orgCode) throw new Error("No organization found")

  // Get the latest transaction number for this type
  const latestTransaction = await prisma.transactions.findFirst({
    where: {
      org_id: org.orgCode,
      type: data.type,
    },
    orderBy: {
      number: 'desc',
    },
  })

  // Extract number from the latest transaction or start at 0
  const lastNumber = latestTransaction?.number
    ? parseInt(latestTransaction.number.split('-')[1])
    : 0

  // Generate new number
  const number = `${data.type}-${(lastNumber + 1).toString().padStart(6, '0')}`

  const result = await prisma.transactions.create({
    data: {
      ...data,
      org_id: org.orgCode,
      number,
      ...(data.entity_id ? { entity_id: data.entity_id } : {}),
      items: {
        create: data.items,
      },
    },
    include: {
      items: {
        include: {
          item: true,
        },
      },
      customer: true,
    },
  })

  // Convert all Decimal values to numbers
  return convertDecimalToNumber(result)
}

interface TransactionDetailsUpdate {
  entity_id?: string | null
  billing_address_id?: string | null
  shipping_address_id?: string | null
  items?: any[]
}

export async function updateTransactionDetails(
  id: string, 
  data: TransactionDetailsUpdate
) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    // First, handle the items if they exist
    if (data.items && data.items.length > 0) {
      // Check for duplicate items in the new items array
      const itemIds = data.items.map(item => item.item_id)
      const duplicateItemId = itemIds.find((id, index) => itemIds.indexOf(id) !== index)
      if (duplicateItemId) {
        // Find the item name for better error message
        const duplicateItem = data.items.find(item => item.item_id === duplicateItemId)
        return {
          data: null,
          error: `Cannot add duplicate item: ${duplicateItem?.item?.name || 'Item'}. Please update the quantity instead.`
        }
      }

      // Get existing items for this transaction
      const existingItems = await prisma.transactionItems.findMany({
        where: { transaction_id: id },
        select: { id: true, item_id: true }
      })

      // Create a map of existing items by item_id
      const existingItemsMap = new Map(
        existingItems.map(item => [item.item_id, item.id])
      )

      // Process each item
      await Promise.all(
        data.items.map(async (item) => {
          const existingItemId = existingItemsMap.get(item.item_id)
          
          // Calculate the total for the line item
          const quantity = Number(item.quantity) || 0
          const unitPrice = Number(item.unit_price) || 0
          const discount = Number(item.discount) || 0
          const lineTotal = (quantity * unitPrice) - discount

          if (existingItemId) {
            // Update existing item
            await prisma.transactionItems.update({
              where: { id: existingItemId },
              data: {
                quantity: item.quantity,
                unit_price: item.unit_price,
                price_level: item.price_level,
                discount: item.discount || 0,
                total: lineTotal,
              },
            })
          } else {
            // Create new item
            await prisma.transactionItems.create({
              data: {
                transaction_id: id,
                item_id: item.item_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                price_level: item.price_level,
                discount: item.discount || 0,
                total: lineTotal,
              },
            })
          }
        })
      )
    }

    const result = await prisma.transactions.update({
      where: { 
        id,
        org_id: org.orgCode 
      },
      data: {
        entity_id: data.entity_id,
        billing_address_id: data.billing_address_id,
        shipping_address_id: data.shipping_address_id,
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
        customer: true,
        billing_address: true,
        shipping_address: true,
        shipments: true,
      },
    })

    // Update the transaction total and related amounts
    const subtotal = result.items.reduce((sum, item) => sum + Number(item.total), 0)
    const tax_amount = Number(result.tax_amount) || 0
    const shipping_cost = Number(result.shipping_cost) || 0
    const total_amount = subtotal + tax_amount + shipping_cost

    await prisma.transactions.update({
      where: { id },
      data: { 
        total: subtotal,
        total_amount,
        tax_amount,
        shipping_cost
      },
    })

    // Get the final result with all updates
    const finalResult = await prisma.transactions.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            item: true,
          },
        },
        customer: true,
        billing_address: true,
        shipping_address: true,
        shipments: true,
      },
    })

    // Convert all Decimal values to numbers
    return {
      data: convertDecimalToNumber(finalResult),
      error: null
    }
  } catch (error) {
    console.error('Failed to update transaction:', error)
    return { data: null, error: 'Failed to update transaction' }
  }
}

export async function updateTransaction(id: string, data: TransactionUpdateInput) {
  const updateData = {
    ...data,
    ...(data.entity_id ? { entity_id: data.entity_id } : {}),
    tax: data.tax || undefined,
  }

  const result = await prisma.transactions.update({
    where: { id },
    data: updateData,
    include: {
      items: {
        include: {
          item: true,
        },
      },
      customer: true,
    },
  })

  // Convert all Decimal values to numbers
  return convertDecimalToNumber(result)
}

export async function deleteTransaction(id: string) {
  // First delete related items
  await prisma.transactionItems.deleteMany({
    where: { transaction_id: id },
  })
  
  // Then delete the transaction
  return await prisma.transactions.delete({
    where: { id },
  })
}
