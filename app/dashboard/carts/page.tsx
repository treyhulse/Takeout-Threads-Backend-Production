import { getCarts, createCart } from '@/lib/supabase/carts'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { CartStatus } from '@/types/carts'

function getStatusColor(status: CartStatus) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-500'
    case 'CHECKOUT_IN_PROGRESS':
      return 'bg-blue-500'
    case 'CONVERTED':
      return 'bg-purple-500'
    case 'ABANDONED':
      return 'bg-red-500'
    case 'EXPIRED':
      return 'bg-gray-500'
    default:
      return 'bg-gray-500'
  }
}

export default async function CartsPage() {
  const { data: carts } = await getCarts()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Carts</h1>
          <p className="text-muted-foreground">Manage your shopping carts</p>
        </div>
        <form action={async () => {
          'use server'
          await createCart()
        }}>
          <Button type="submit">Create New Cart</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Carts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carts?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Carts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {carts?.filter(cart => cart.status === 'ACTIVE').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted Carts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {carts?.filter(cart => cart.status === 'CONVERTED').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abandoned Carts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {carts?.filter(cart => cart.status === 'ABANDONED').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carts?.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell className="font-medium">{cart.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(cart.status)}>
                      {cart.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {cart.customer
                      ? `${cart.customer.first_name} ${cart.customer.last_name}`
                      : 'No Customer'}
                  </TableCell>
                  <TableCell>{cart.items?.length || 0} items</TableCell>
                  <TableCell>${Number(cart.total_amount).toFixed(2)}</TableCell>
                  <TableCell>{formatDate(cart.created_at)}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/carts/${cart.id}`}>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {!carts?.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No carts found. Create one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
