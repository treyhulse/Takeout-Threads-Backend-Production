import { getCart } from '@/lib/supabase/carts'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function CartPage({ params }: { params: { id: string } }) {
  const { success, data: cart } = await getCart(params.id)

  if (!success || !cart) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Cart Details</h1>
          <p className="text-muted-foreground">
            Cart ID: {cart.id}
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/carts">
            <Button variant="outline">Back to Carts</Button>
          </Link>
          <Button>Convert to Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Cart Information</CardTitle>
            <CardDescription>Basic details about this cart</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                  <Badge>{cart.status}</Badge>
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                  {formatDate(cart.created_at)}
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                  {formatDate(cart.updated_at)}
                </dd>
              </div>
              {cart.expires_at && (
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Expires</dt>
                  <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                    {formatDate(cart.expires_at)}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Details about the cart&apos;s customer</CardDescription>
          </CardHeader>
          <CardContent>
            {cart.customer ? (
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                    {cart.customer.first_name} {cart.customer.last_name}
                  </dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                    {cart.customer.email}
                  </dd>
                </div>
                {cart.customer.phone && (
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                      {cart.customer.phone}
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">No customer assigned</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cart Items</CardTitle>
          <CardDescription>Products in this cart</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.item.name}</TableCell>
                  <TableCell>{item.item.sku}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ${Number(item.unit_price).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${Number(item.total).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {!cart.items?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No items in cart
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cart Summary</CardTitle>
          <CardDescription>Financial summary of the cart</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                ${Number(cart.total).toFixed(2)}
              </dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Tax</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                ${Number(cart.tax_amount).toFixed(2)}
              </dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Shipping</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                ${Number(cart.shipping_cost).toFixed(2)}
              </dd>
            </div>
            {Number(cart.discount_total) > 0 && (
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Discount</dt>
                <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 text-red-600">
                  -${Number(cart.discount_total).toFixed(2)}
                </dd>
              </div>
            )}
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Total</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 font-bold">
                ${Number(cart.total_amount).toFixed(2)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
} 