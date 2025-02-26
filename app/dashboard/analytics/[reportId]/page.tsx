"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { ChartContainer } from "@/components/charts/ChartContainer"
import { Bar, BarChart, Line, LineChart, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Loader2, Edit, Share2 } from "lucide-react"
import { toast } from "sonner"
import { getReports, updateReport, executeReport } from "@/lib/supabase/reports"
import { ReportFormData } from "@/types/reports"
import { Skeleton } from "@/components/ui/skeleton"
import { Prisma } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ReportPage() {
  const params = useParams()
  const router = useRouter()
  const [report, setReport] = useState<ReportFormData | null>(null)
  const [reportData, setReportData] = useState<Record<string, any>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedReport, setEditedReport] = useState<ReportFormData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  const executeReportData = useCallback(async () => {
    try {
      setIsExecuting(true)
      const { data, error } = await executeReport(params.reportId as string)
      
      if (error) {
        toast("Failed to execute report", {
          description: error
        })
        return
      }

      setReportData(data as Record<string, any>[] || [])
    } catch (error) {
      console.error('Error executing report:', error)
      toast("Failed to execute report", {
        description: String(error)
      })
    } finally {
      setIsExecuting(false)
    }
  }, [params.reportId])

  const loadReport = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await getReports()
      
      if (error) {
        toast("Failed to load reports", {
          description: error
        })
        return
      }

      const reportData = data?.find((r: any) => r.id === params.reportId)
      if (!reportData || !reportData.config) {
        toast("Report not found")
        router.push("/dashboard/analytics")
        return
      }

      const transformedReport: ReportFormData = {
        name: reportData.name,
        description: reportData.description || "",
        type: reportData.type,
        is_public: reportData.is_public,
        base_record: (reportData.config as Prisma.JsonObject).base_record?.toString() || "",
        config: reportData.config as unknown as ReportFormData["config"],
      }

      setReport(transformedReport)
    } catch (error) {
      console.error('Error loading report:', error)
      toast("Failed to load report", {
        description: String(error)
      })
    } finally {
      setIsLoading(false)
    }
  }, [params.reportId, router])

  useEffect(() => {
    loadReport()
  }, [loadReport])

  useEffect(() => {
    if (report) {
      executeReportData()
    }
  }, [report, executeReportData])

  const handleEdit = () => {
    setEditedReport(report)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditedReport(null)
    setIsEditing(false)
  }

  const handleSave = async () => {
    try {
      if (!editedReport) return
      setIsSaving(true)
      
      const { error } = await updateReport(params.reportId as string, editedReport)
      
      if (error) {
        toast("Failed to save report", {
          description: error
        })
        return
      }

      toast("Report saved successfully")
      setReport(editedReport)
      setIsEditing(false)
      setEditedReport(null)
    } catch (error) {
      console.error('Error saving report:', error)
      toast("Failed to save report", {
        description: String(error)
      })
    } finally {
      setIsSaving(false)
    }
  }

  const renderChart = () => {
    if (!report || !reportData.length) {
      return <div className="text-center text-muted-foreground">No data available</div>
    }

    // Get visualization type from config, fallback to report type if not set
    const type = (report.config.visualization?.type || report.type.toLowerCase())
      .replace('_chart', '')
      .toLowerCase()

    switch (type) {
      case "bar":
        return (
          <BarChart width={600} height={400} data={reportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={report.config.dimensions[0]} />
            <YAxis />
            <Tooltip />
            <Legend />
            {report.config.metrics.map((metric, index) => (
              <Bar key={metric} dataKey={metric} fill={`hsl(${index * 30}, 70%, 50%)`} />
            ))}
          </BarChart>
        )
      case "line":
        return (
          <LineChart width={600} height={400} data={reportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={report.config.dimensions[0]} />
            <YAxis />
            <Tooltip />
            <Legend />
            {report.config.metrics.map((metric, index) => (
              <Line key={metric} type="monotone" dataKey={metric} stroke={`hsl(${index * 30}, 70%, 50%)`} />
            ))}
          </LineChart>
        )
      case "pie":
        return (
          <PieChart width={600} height={400}>
            <Pie
              data={reportData}
              dataKey={report.config.metrics[0]}
              nameKey={report.config.dimensions[0]}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="hsl(var(--primary))"
              label
            />
            <Tooltip />
            <Legend />
          </PieChart>
        )
      case "table":
        return (
          <div className="w-full h-full overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {report.config.dimensions.map((dimension) => (
                    <th key={dimension} className="p-2 text-left border-b bg-muted">
                      {dimension}
                    </th>
                  ))}
                  {report.config.metrics.map((metric) => (
                    <th key={metric} className="p-2 text-left border-b bg-muted">
                      {metric}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    {report.config.dimensions.map((dimension) => (
                      <td key={dimension} className="p-2 border-b">
                        {row[dimension]}
                      </td>
                    ))}
                    {report.config.metrics.map((metric) => (
                      <td key={metric} className="p-2 border-b">
                        {typeof row[metric] === 'number' ? row[metric].toLocaleString() : row[metric]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      case "kpi":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.config.metrics.map((metric) => {
              const value = reportData.reduce((sum, row) => sum + (row[metric] || 0), 0)
              return (
                <div key={metric} className="p-4 rounded-lg border bg-card text-card-foreground">
                  <h3 className="text-sm font-medium text-muted-foreground">{metric}</h3>
                  <p className="text-2xl font-bold">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </p>
                </div>
              )
            })}
          </div>
        )
      default:
        return <div className="text-center text-muted-foreground">Unsupported chart type</div>
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Report not found</h2>
          <p className="text-muted-foreground">This report may have been deleted or you don&apos;t have access to it.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard/analytics")}>
            Back to Reports
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard/analytics")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Report Name</Label>
                <Input
                  id="name"
                  value={editedReport?.name}
                  onChange={(e) => setEditedReport(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="max-w-md"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedReport?.description}
                  onChange={(e) => setEditedReport(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="max-w-md"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editedReport?.is_public}
                    onCheckedChange={(checked) => setEditedReport(prev => prev ? { ...prev, is_public: checked } : null)}
                  />
                  <Label>Public Report</Label>
                </div>
                <Select
                  value={editedReport?.type}
                  onValueChange={(value) => setEditedReport(prev => prev ? { ...prev, type: value as any } : null)}
                >
                  <SelectTrigger className="w-[180px]">
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
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold">{report.name}</h1>
              <p className="text-muted-foreground">{report.description}</p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={executeReportData} disabled={isExecuting}>
            {isExecuting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              "Refresh Data"
            )}
          </Button>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Report
              </Button>
              <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Report</DialogTitle>
                    <DialogDescription>
                      Share this report with other users or make it public.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={report.is_public}
                        onCheckedChange={(checked) => setReport(prev => prev ? { ...prev, is_public: checked } : null)}
                      />
                      <Label>Make Report Public</Label>
                    </div>
                    {/* Add user sharing functionality here */}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <Card className="p-6">
        <div className="h-[500px]">
          <ChartContainer className="w-full h-full" config={{
            chart1: { label: report.name, color: "hsl(var(--primary))" }
          }}>
            {renderChart() || (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading chart...</p>
              </div>
            )}
          </ChartContainer>
        </div>
      </Card>
    </div>
  )
}