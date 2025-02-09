"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChart3,
  BookMarked,
  Calendar,
  DollarSign,
  Download,
  LineChartIcon,
  Loader2,
  Plus,
  Share2,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AnalyticsPage() {
  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    orders: {
      label: "Orders",
      color: "hsl(var(--chart-2))",
    },
    customers: {
      label: "Customers",
      color: "hsl(var(--chart-3))",
    },
  }

  // Sample data
  const revenueData = [
    { date: "2024-01", revenue: 2400, orders: 145, customers: 120 },
    { date: "2024-02", revenue: 1398, orders: 132, customers: 115 },
    { date: "2024-03", revenue: 9800, orders: 164, customers: 180 },
    { date: "2024-04", revenue: 3908, orders: 189, customers: 160 },
    { date: "2024-05", revenue: 4800, orders: 176, customers: 170 },
    { date: "2024-06", revenue: 3800, orders: 203, customers: 190 },
    { date: "2024-07", revenue: 4300, orders: 211, customers: 195 },
  ]

  const popularReports = [
    {
      id: 1,
      name: "Revenue by Product Category",
      type: "bar",
      users: 234,
      saved: true,
    },
    {
      id: 2,
      name: "Customer Acquisition Cost",
      type: "line",
      users: 189,
      saved: false,
    },
    {
      id: 3,
      name: "Order Fulfillment Time",
      type: "bar",
      users: 156,
      saved: true,
    },
  ]

  const sharedReports = [
    {
      id: 1,
      name: "Q1 Performance Analysis",
      sharedBy: "Emma Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      date: "2024-02-01",
    },
    {
      id: 2,
      name: "Customer Retention Metrics",
      sharedBy: "Alex Thompson",
      avatar: "/placeholder.svg?height=32&width=32",
      date: "2024-02-03",
    },
  ]

  const aiInsights = [
    "Revenue has increased by 25% compared to last quarter",
    "Customer retention rate is showing positive trends",
    "Top performing product category: Custom T-Shirts",
    "Recommended action: Increase marketing spend on weekends",
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Key Metrics Cards */}
        <Card className="bg-blue-950 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <div className="flex items-center pt-1 text-xs text-green-400">
              <ArrowUpIcon className="h-4 w-4" />
              <span>+20.1% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <div className="flex items-center pt-1 text-xs text-red-500">
              <ArrowDownIcon className="h-4 w-4" />
              <span>-4% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpIcon className="h-4 w-4" />
              <span>+19% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-300 to-yellow-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Score</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.3</div>
            <div className="flex items-center pt-1 text-xs">
              <Star className="h-4 w-4 mr-1" />
              <span>Excellent Performance</span>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Card - Spans 2 columns */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">AI Insights</CardTitle>
              <Badge variant="secondary" className="bg-blue-950 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by AI
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-yellow-300" />
                  <p>{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shared Reports Card - Spans 2 columns */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Shared Reports</CardTitle>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sharedReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={report.avatar} />
                      <AvatarFallback>{report.sharedBy[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Shared by {report.sharedBy} • {new Date(report.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Report Builder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium">Custom Report Builder</CardTitle>
              <CardDescription>Create and customize your analytics reports</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="7d">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Loader2 className="mr-2 h-4 w-4" />
                Generate
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Metrics</label>
              <Select defaultValue="revenue">
                <SelectTrigger>
                  <SelectValue placeholder="Select metrics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Visualization</label>
              <Select defaultValue="line">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Grouping</label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue placeholder="Select grouping" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <ChartContainer config={chartConfig} className="h-[400px]">
              <LineChart data={revenueData}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                    })
                  }}
                />
                <YAxis />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} />
                <Line type="monotone" dataKey="customers" stroke="var(--color-customers)" strokeWidth={2} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Popular Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {popularReports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{report.name}</CardTitle>
                {report.type === "bar" ? (
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <LineChartIcon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center bg-muted/5 rounded-md">
                {report.type === "bar" ? (
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart data={revenueData.slice(-4)}>
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                          })
                        }}
                      />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <LineChart data={revenueData.slice(-4)}>
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                          })
                        }}
                      />
                      <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </LineChart>
                  </ChartContainer>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                {report.users} users
              </div>
              <Button variant="ghost" size="sm">
                {report.saved ? <BookMarked className="h-4 w-4 mr-1" /> : <Calendar className="h-4 w-4 mr-1" />}
                {report.saved ? "Saved" : "Schedule"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

