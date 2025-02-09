import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Circle as CircleIcon, 
  Shirt as ShirtIcon, 
  Clock as ClockIcon, 
  AlertCircle as AlertCircleIcon, 
  MessageSquare as MessageSquareIcon,
  Truck as TruckIcon 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { OrdersChart } from "@/components/dashboard/OrdersChart"

const mockData = [
  { month: 'Jan', orders: 65 },
  { month: 'Feb', orders: 59 },
  { month: 'Mar', orders: 80 },
  { month: 'Apr', orders: 81 },
  { month: 'May', orders: 56 },
  { month: 'Jun', orders: 95 },
]

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      {/* KPI Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Orders</CardTitle>
            <ShirtIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>

            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Production</CardTitle>
            <CircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">18 due today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <CircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,834</div>
            <p className="text-xs text-muted-foreground">+8% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ink Inventory</CardTitle>
            <CircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <Progress value={82} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activity Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Orders Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OrdersChart data={mockData} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <TruckIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">Order #1234 shipped</p>
                  <p className="text-sm text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <ShirtIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">New order received</p>
                  <p className="text-sm text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <AlertCircleIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">Low ink alert: Black</p>
                  <p className="text-sm text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Reminders */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button className="w-full">
              Create New Order
            </Button>
            <Button variant="outline" className="w-full">
              View Production Queue
            </Button>
            <Button variant="outline" className="w-full">
              Update Inventory
            </Button>
            <Button variant="outline" className="w-full">
              Schedule Maintenance
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <ClockIcon className="mr-2 h-4 w-4 text-red-500" />
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">Screen cleaning due</p>
                  <p className="text-sm text-muted-foreground">Today, 5:00 PM</p>
                </div>
              </div>
              <div className="flex items-center">
                <ClockIcon className="mr-2 h-4 w-4 text-yellow-500" />
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">Ink inventory check</p>
                  <p className="text-sm text-muted-foreground">Tomorrow, 9:00 AM</p>
                </div>
              </div>
              <div className="flex items-center">
                <MessageSquareIcon className="mr-2 h-4 w-4 text-blue-500" />
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">Team meeting</p>
                  <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
