"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, CreditCard, DollarSign, Download } from "lucide-react"
import { toast } from "sonner"

interface Invoice {
  id: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  date: string
  invoice_url: string
}

interface Payout {
  id: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  date: string
  reference: string
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)

  const fetchBillingData = async () => {
    try {
      // TODO: Implement these functions to fetch from your Stripe backend
      // const { data: invoicesData } = await getStripeInvoices(org_id)
      // const { data: payoutsData } = await getStripePayouts(org_id)
      // const { data: subscriptionData } = await getStripeSubscription(org_id)
      
      // Temporary mock data
      setInvoices([
        {
          id: '1',
          amount: 49.99,
          status: 'paid',
          date: '2024-03-01',
          invoice_url: '#'
        }
      ])
      setPayouts([
        {
          id: '1',
          amount: 150.00,
          status: 'paid',
          date: '2024-03-01',
          reference: 'PO-123456'
        }
      ])
      setSubscription({
        plan: 'Pro',
        amount: 49.99,
        interval: 'month',
        status: 'active',
        current_period_end: '2024-04-01'
      })
    } catch (error) {
      toast.error("Failed to fetch billing data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBillingData()
  }, [])

  const handleUpdateBilling = async () => {
    try {
      // TODO: Implement stripe customer portal redirect
      // const { url } = await createStripePortalSession(org_id)
      // window.location.href = url
      toast.info("Redirecting to billing portal...")
    } catch (error) {
      toast.error("Failed to redirect to billing portal")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
        <p className="text-muted-foreground">Manage your subscription and view payment history</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the {subscription?.plan} plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold">${subscription?.amount}</span>
              <span className="text-muted-foreground">/{subscription?.interval}</span>
            </div>
            <div className="space-y-2">
              <Badge variant={subscription?.status === 'active' ? 'default' : 'destructive'}>
                {subscription?.status}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Next billing date: {new Date(subscription?.current_period_end).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpdateBilling}>
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Subscription
            </Button>
          </CardFooter>
        </Card>

        {/* Balance Card */}
        <Card>
          <CardHeader>
            <CardTitle>Available for Payout</CardTitle>
            <CardDescription>Your current balance from sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold">$1,234.56</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Request Payout
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="h-4 w-[100px] animate-pulse rounded bg-muted"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-[80px] animate-pulse rounded bg-muted"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-[60px] animate-pulse rounded bg-muted"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-[100px] animate-pulse rounded bg-muted"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No invoices found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            invoice.status === 'paid' ? 'default' :
                            invoice.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={invoice.invoice_url} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="h-4 w-[100px] animate-pulse rounded bg-muted"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-[80px] animate-pulse rounded bg-muted"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-[60px] animate-pulse rounded bg-muted"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-[100px] animate-pulse rounded bg-muted"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : payouts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No payouts found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                        <TableCell>${payout.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            payout.status === 'paid' ? 'default' :
                            payout.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{payout.reference}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
