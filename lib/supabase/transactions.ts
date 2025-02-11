"use server"

import prisma from "@/utils/db"
import { TransactionCreateInput, TransactionUpdateInput } from "@/types/transactions"
import { TransactionType } from "@prisma/client"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { revalidatePath } from "next/cache"

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

    const data = transactions.map(t => ({
      ...t,
      total: Number(t.total),
      tax: t.tax ? Number(t.tax) : null,
      shipping: t.shipping ? Number(t.shipping) : null,
      items: t.items.map(item => ({
        ...item,
        total: Number(item.total),
        unit_price: Number(item.unit_price),
        discount: item.discount ? Number(item.discount) : null
      }))
    }))

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
      customer: true
    }
  })

  if (!transaction) return null

  // Convert Decimal to number
  return {
    ...transaction,
    total: Number(transaction.total),
    tax: transaction.tax ? Number(transaction.tax) : null,
    shipping: transaction.shipping ? Number(transaction.shipping) : null,
    items: transaction.items.map(item => ({
      ...item,
      total: Number(item.total),
      unit_price: Number(item.unit_price),
      discount: item.discount ? Number(item.discount) : null
    }))
  }
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

  return await prisma.transactions.create({
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
}

export async function updateTransaction(id: string, data: TransactionUpdateInput) {
  const updateData = {
    ...data,
    ...(data.entity_id ? { entity_id: data.entity_id } : {}),
    tax: data.tax || undefined,
    shipping: data.shipping || undefined,
    items: {
      // Your items update logic here
    }
  }

  return await prisma.transactions.update({
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
