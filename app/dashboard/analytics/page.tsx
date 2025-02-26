"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Loader2,
  Trash2,
  Edit,
  Share2,
} from "lucide-react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createReport, getReports, deleteReport } from "@/lib/supabase/reports"
import { baseRecordTypes } from "@/lib/utils/schema-fields"
import { toast } from "sonner"
import { Metric, Dimension, BaseRecordType, ReportType, ReportFormData } from "@/types/reports"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const reportSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["BAR_CHART", "LINE_CHART", "PIE_CHART", "TABLE", "KPI"]),
  is_public: z.boolean().default(false),
  base_record: z.string().min(1, "Base record type is required"),
  config: z.object({
    metrics: z.array(z.string()),
    dimensions: z.array(z.string()),
    filters: z.array(z.object({
      field: z.string(),
      operator: z.string(),
      value: z.string(),
    })).optional(),
    visualization: z.object({
      type: z.string(),
      options: z.record(z.any()),
    }),
  }),
})

export default function AnalyticsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [isCreatingReport, setIsCreatingReport] = useState(false)
  const [selectedBaseRecord, setSelectedBaseRecord] = useState<BaseRecordType | null>(null)
  const [selectedMetrics, setSelectedMetrics] = useState<Metric[]>([])
  const [selectedDimensions, setSelectedDimensions] = useState<Dimension[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [reportToDelete, setReportToDelete] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "BAR_CHART",
      is_public: false,
      base_record: "",
      config: {
        metrics: [],
        dimensions: [],
        filters: [],
        visualization: {
          type: "bar",
          options: {},
        },
      },
    },
  })

  const onBaseRecordChange = (recordId: string) => {
    const baseRecord = baseRecordTypes.find(r => r.id === recordId)
    setSelectedBaseRecord(baseRecord || null)
    setSelectedMetrics([])
    setSelectedDimensions([])
    form.setValue("base_record", recordId)
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !selectedBaseRecord) return

    const { source, destination } = result
    const [sourceGroup, sourceId] = source.droppableId.split("-")
    const [destGroup, destId] = destination.droppableId.split("-")

    if (sourceGroup === "metrics" && destGroup === "selected") {
      let metric: Metric | undefined
      
      if (sourceId === "base") {
        metric = selectedBaseRecord.metrics[source.index]
      } else {
        const relation = selectedBaseRecord.relations.find(r => r.table === sourceId)
        if (relation) {
          metric = relation.metrics[source.index]
        }
      }

      if (metric && !selectedMetrics.find(m => m.id === metric!.id)) {
        setSelectedMetrics([...selectedMetrics, metric])
      }
    } else if (sourceGroup === "dimensions" && destGroup === "selected") {
      let dimension: Dimension | undefined
      
      if (sourceId === "base") {
        dimension = selectedBaseRecord.dimensions[source.index]
      } else {
        const relation = selectedBaseRecord.relations.find(r => r.table === sourceId)
        if (relation) {
          dimension = relation.dimensions[source.index]
        }
      }

      if (dimension && !selectedDimensions.find(d => d.id === dimension!.id)) {
        setSelectedDimensions([...selectedDimensions, dimension])
      }
    } else if (sourceGroup === "selected" && destGroup === "selected") {
      if (sourceId === "metrics") {
        const items = Array.from(selectedMetrics)
        const [removed] = items.splice(source.index, 1)
        items.splice(destination.index, 0, removed)
        setSelectedMetrics(items)
      } else if (sourceId === "dimensions") {
        const items = Array.from(selectedDimensions)
        const [removed] = items.splice(source.index, 1)
        items.splice(destination.index, 0, removed)
        setSelectedDimensions(items)
      }
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await getReports()
      
      if (error) {
        toast.error(error)
        return
      }
      if (data) {
        setReports(data)
      }
    } catch (error) {
      console.error('Error in loadReports:', error)
      toast.error("An unexpected error occurred while loading reports")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateReport = async () => {
    try {
      const formData = form.getValues()
      const visualizationType = formData.type.toLowerCase() as "bar" | "line" | "pie"
      const reportData = {
        ...formData,
        type: formData.type as ReportType,
        config: {
          metrics: selectedMetrics.map(m => m.id),
          dimensions: selectedDimensions.map(d => d.id),
          base_record: formData.base_record,
          filters: [],
          visualization: {
            type: visualizationType,
            options: {},
          },
        },
      }

      if (selectedMetrics.length === 0) {
        toast.error("Please select at least one metric")
        return
      }

      if (selectedDimensions.length === 0) {
        toast.error("Please select at least one dimension")
        return
      }

      const { error } = await createReport(reportData)
      if (error) {
        toast.error(error)
        return
      }

      toast.success("Report created successfully")
      setIsCreatingReport(false)
      form.reset()
      setSelectedBaseRecord(null)
      setSelectedMetrics([])
      setSelectedDimensions([])
      loadReports()
    } catch (error) {
      console.error('Error in handleCreateReport:', error)
      toast.error("An unexpected error occurred while creating the report")
    }
  }

  const handleDeleteReport = async (id: string) => {
    try {
      const { error } = await deleteReport(id)
      if (error) {
        toast.error(error)
        return
      }
      toast.success("Report deleted successfully")
      loadReports()
    } catch (error) {
      console.error('Error in handleDeleteReport:', error)
      toast.error("An unexpected error occurred while deleting the report")
    } finally {
      setReportToDelete(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">Create and manage your custom reports</p>
        </div>
        <Dialog open={isCreatingReport} onOpenChange={setIsCreatingReport}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Report</DialogTitle>
              <DialogDescription>
                Select a base record type and customize your report with available metrics and dimensions
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="builder" className="w-full">
              <TabsList>
                <TabsTrigger value="builder">Report Builder</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="builder">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 space-y-4">
                    <Form {...form}>
                      <form className="space-y-4">
                        <FormField
                          control={form.control}
                          name="base_record"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Base Record Type</FormLabel>
                              <Select
                                onValueChange={(value) => onBaseRecordChange(value)}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select base record type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {baseRecordTypes.map((record) => (
                                    <SelectItem key={record.id} value={record.id}>
                                      {record.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Report Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter report name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Enter description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chart Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select chart type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="BAR_CHART">Bar Chart</SelectItem>
                                  <SelectItem value="LINE_CHART">Line Chart</SelectItem>
                                  <SelectItem value="PIE_CHART">Pie Chart</SelectItem>
                                  <SelectItem value="TABLE">Table</SelectItem>
                                  <SelectItem value="KPI">KPI</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="is_public"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel>Public Report</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </div>
                  {selectedBaseRecord ? (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <div className="col-span-9 grid grid-cols-3 gap-4">
                        {/* Base Record Metrics */}
                        <div className="space-y-4">
                          <h3 className="font-semibold">Base Record Metrics</h3>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">{selectedBaseRecord.label}</h4>
                            <Droppable droppableId="metrics-base">
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="min-h-[100px] bg-muted p-2 rounded-lg"
                                >
                                  {selectedBaseRecord.metrics.map((metric, index) => (
                                    <Draggable
                                      key={metric.id}
                                      draggableId={metric.id}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="bg-background p-2 mb-2 rounded shadow text-sm"
                                        >
                                          {metric.label}
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                          {selectedBaseRecord.relations.map((relation) => (
                            <div key={relation.table} className="space-y-2">
                              <h4 className="text-sm font-medium text-muted-foreground">{relation.table} Metrics</h4>
                              <Droppable droppableId={`metrics-${relation.table}`}>
                                {(provided) => (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="min-h-[100px] bg-muted p-2 rounded-lg"
                                  >
                                    {relation.metrics.map((metric, index) => (
                                      <Draggable
                                        key={metric.id}
                                        draggableId={metric.id}
                                        index={index}
                                      >
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="bg-background p-2 mb-2 rounded shadow text-sm"
                                          >
                                            {metric.label}
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          ))}
                        </div>

                        {/* Base Record Dimensions */}
                        <div className="space-y-4">
                          <h3 className="font-semibold">Base Record Dimensions</h3>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">{selectedBaseRecord.label}</h4>
                            <Droppable droppableId="dimensions-base">
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="min-h-[100px] bg-muted p-2 rounded-lg"
                                >
                                  {selectedBaseRecord.dimensions.map((dimension, index) => (
                                    <Draggable
                                      key={dimension.id}
                                      draggableId={dimension.id}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="bg-background p-2 mb-2 rounded shadow text-sm"
                                        >
                                          {dimension.label}
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                          {selectedBaseRecord.relations.map((relation) => (
                            <div key={relation.table} className="space-y-2">
                              <h4 className="text-sm font-medium text-muted-foreground">{relation.table} Dimensions</h4>
                              <Droppable droppableId={`dimensions-${relation.table}`}>
                                {(provided) => (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="min-h-[100px] bg-muted p-2 rounded-lg"
                                  >
                                    {relation.dimensions.map((dimension, index) => (
                                      <Draggable
                                        key={dimension.id}
                                        draggableId={dimension.id}
                                        index={index}
                                      >
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="bg-background p-2 mb-2 rounded shadow text-sm"
                                          >
                                            {dimension.label}
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          ))}
                        </div>

                        {/* Selected Fields */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Selected Metrics</h3>
                            <Droppable droppableId="selected-metrics">
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="min-h-[100px] bg-muted p-2 rounded-lg mb-4"
                                >
                                  {selectedMetrics.map((metric, index) => (
                                    <Draggable
                                      key={metric.id}
                                      draggableId={`selected-${metric.id}`}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="bg-background p-2 mb-2 rounded shadow text-sm"
                                        >
                                          {metric.label}
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Selected Dimensions</h3>
                            <Droppable droppableId="selected-dimensions">
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="min-h-[100px] bg-muted p-2 rounded-lg"
                                >
                                  {selectedDimensions.map((dimension, index) => (
                                    <Draggable
                                      key={dimension.id}
                                      draggableId={`selected-${dimension.id}`}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="bg-background p-2 mb-2 rounded shadow text-sm"
                                        >
                                          {dimension.label}
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        </div>
                      </div>
                    </DragDropContext>
                  ) : (
                    <div className="col-span-9 flex items-center justify-center bg-muted rounded-lg p-8">
                      <p className="text-muted-foreground">
                        Select a base record type to start building your report
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="preview">
                <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
                  {selectedMetrics.length === 0 && selectedDimensions.length === 0 ? (
                    <p className="text-muted-foreground">
                      Select metrics and dimensions to preview your report
                    </p>
                  ) : (
                    <ChartContainer className="w-full h-full" config={{
                      chart1: { label: "Preview", color: "hsl(var(--primary))" }
                    }}>
                      <BarChart data={[]}>
                        <XAxis />
                        <YAxis />
                        {selectedMetrics.map((metric) => (
                          <Bar
                            key={metric.id}
                            dataKey={metric.id}
                            name={metric.label}
                            fill={`hsl(var(--chart-${selectedMetrics.indexOf(metric) + 1}))`}
                          />
                        ))}
                      </BarChart>
                    </ChartContainer>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatingReport(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleCreateReport}>
                Create Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : reports.length === 0 ? (
          <div className="col-span-full">
            <Card className="bg-muted">
              <CardHeader className="text-center">
                <CardTitle>No Reports Yet</CardTitle>
                <CardDescription>Create your first report to get started</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : (
          reports.map((report) => (
            <Card 
              key={report.id} 
              className="cursor-pointer transition-all hover:shadow-lg"
              onClick={() => router.push(`/dashboard/analytics/${report.id}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">{report.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Share functionality will be added later
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        setReportToDelete(report.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] bg-muted rounded-lg">
                  {/* Report preview will go here */}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={!!reportToDelete} onOpenChange={(open) => !open && setReportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the report and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button 
              variant="destructive"
              onClick={() => reportToDelete && handleDeleteReport(reportToDelete)}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

