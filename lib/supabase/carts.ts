"use server"

import prisma from '@/utils/db'
import { Cart, CartStatus } from '@/types/carts'
import { CartItems } from '@/types/cartItems'
import { revalidatePath } from 'next/cache'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function createCart() {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const cart = await prisma.cart.create({
      data: {
        org_id: org.orgCode,
        status: 'ACTIVE',
        total: 0,
        tax_amount: 0,
        shipping_cost: 0,
        discount_total: 0,
        total_amount: 0,
        total_weight: 0,
      },
    })

    revalidatePath('/dashboard/carts')
    return { success: true, data: cart }
  } catch (error) {
    console.error('Error creating cart:', error)
    return { success: false, error: 'Failed to create cart' }
  }
}

export async function addItemToCart(
  cartId: string,
  itemId: string,
  quantity: number,
  unitPrice: number
) {
  try {
    // Calculate total for the cart item
    const total = quantity * unitPrice

    // Create cart item
    const cartItem = await prisma.cartItems.create({
      data: {
        cart_id: cartId,
        item_id: itemId,
        quantity,
        unit_price: unitPrice,
        total,
      },
    })

    // Update cart totals
    await updateCartTotals(cartId)

    revalidatePath('/dashboard/carts')
    return { success: true, data: cartItem }
  } catch (error) {
    console.error('Error adding item to cart:', error)
    return { success: false, error: 'Failed to add item to cart' }
  }
}

export async function getCart(id: string) {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const cart = await prisma.cart.findFirst({
      where: { 
        id,
        org_id: org.orgCode 
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
        discount: true,
      },
    })

    if (!cart) throw new Error("Cart not found")

    return { success: true, data: cart }
  } catch (error) {
    console.error('Error fetching cart:', error)
    return { success: false, error: 'Failed to fetch cart' }
  }
}

export async function getCarts() {
  try {
    const { getOrganization } = getKindeServerSession()
    const org = await getOrganization()
    
    if (!org?.orgCode) throw new Error("No organization found")

    const carts = await prisma.cart.findMany({
      where: { org_id: org.orgCode },
      include: {
        items: {
          include: {
            item: true,
          },
        },
        customer: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return { success: true, data: carts }
  } catch (error) {
    console.error('Error fetching carts:', error)
    return { success: false, error: 'Failed to fetch carts' }
  }
}

async function updateCartTotals(cartId: string) {
  try {
    // Get all items in the cart
    const cartItems = await prisma.cartItems.findMany({
      where: { cart_id: cartId },
    })

    // Calculate totals
    const total = cartItems.reduce((sum, item) => sum + Number(item.total), 0)

    // Update cart
    await prisma.cart.update({
      where: { id: cartId },
      data: {
        total,
        total_amount: total, // This will be adjusted when tax and shipping are added
      },
    })
  } catch (error) {
    console.error('Error updating cart totals:', error)
    throw error
  }
}

export async function updateCartStatus(cartId: string, status: CartStatus) {
  try {
    const cart = await prisma.cart.update({
      where: { id: cartId },
      data: { status },
    })

    revalidatePath('/dashboard/carts')
    return { success: true, data: cart }
  } catch (error) {
    console.error('Error updating cart status:', error)
    return { success: false, error: 'Failed to update cart status' }
  }
}

export async function removeItemFromCart(cartId: string, itemId: string) {
  try {
    await prisma.cartItems.delete({
      where: {
        cart_id_item_id: {
          cart_id: cartId,
          item_id: itemId,
        },
      },
    })

    // Update cart totals
    await updateCartTotals(cartId)

    revalidatePath('/dashboard/carts')
    return { success: true }
  } catch (error) {
    console.error('Error removing item from cart:', error)
    return { success: false, error: 'Failed to remove item from cart' }
  }
} 