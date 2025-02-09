"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CalendarIcon, Clock, Filter, LayoutGrid, List, Plus, ShoppingBag, Truck } from "lucide-react"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState("month")

  // Sample data
  const events = [
    {
      id: 1,
      title: "Order #3210 Production",
      type: "order",
      status: "in-progress",
      time: "09:00 AM",
      duration: "2 hours",
      details: "12 Custom T-Shirts - Rush Order",
    },
    {
      id: 2,
      title: "Restock Inventory",
      type: "task",
      status: "pending",
      time: "11:00 AM",
      duration: "1 hour",
      details: "Order new blank t-shirts from supplier",
    },
    {
      id: 3,
      title: "Order #3211 Delivery",
      type: "delivery",
      status: "scheduled",
      time: "02:00 PM",
      duration: "30 mins",
      details: "Local delivery - 5 mile radius",
    },
    {
      id: 4,
      title: "Order #3212 Delivery",
      type: "delivery",
      status: "scheduled",
      time: "02:00 PM",
      duration: "30 mins",
      details: "Local delivery - 5 mile radius",
    }
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-4 w-4" />
      case "task":
        return <AlertCircle className="h-4 w-4" />
      case "delivery":
        return <Truck className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-950 text-white"
      case "task":
        return "bg-yellow-300 text-black"
      case "delivery":
        return "bg-green-600 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Calendar</h1>
          <p className="text-muted-foreground">Schedule and manage your production timeline</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>Create a new event in your production calendar</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" placeholder="Enter event title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Event Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">Production Order</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date & Time</Label>
                  <div className="flex gap-2">
                    <Input type="date" />
                    <Input type="time" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="details">Details</Label>
                  <Textarea placeholder="Add event details..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Calendar</CardTitle>
              <CardDescription>View and manage your schedule</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Today
              </Button>
              <Select defaultValue={view} onValueChange={setView}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </CardContent>
        </Card>

        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id}>
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-sm">{event.title}</CardTitle>
                          <CardDescription>
                            {event.time} • {event.duration}
                          </CardDescription>
                        </div>
                        <Badge className={getEventColor(event.type)}>
                          <div className="flex items-center gap-1">
                            {getEventIcon(event.type)}
                            {event.type}
                          </div>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <p className="text-sm text-muted-foreground">{event.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader className="space-y-0 pb-2">
                  <Badge className={getEventColor(event.type)}>
                    <div className="flex items-center gap-1">
                      {getEventIcon(event.type)}
                      {event.type}
                    </div>
                  </Badge>
                  <CardTitle className="mt-2 text-sm">{event.title}</CardTitle>
                  <CardDescription>
                    {event.time} • {event.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{event.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="production">
          <Card>
            <CardHeader>
              <CardTitle>Production Schedule</CardTitle>
              <CardDescription>View and manage production orders</CardDescription>
            </CardHeader>
            <CardContent>{/* Production schedule content */}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Schedule</CardTitle>
              <CardDescription>Track deliveries and shipments</CardDescription>
            </CardHeader>
            <CardContent>{/* Delivery schedule content */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

