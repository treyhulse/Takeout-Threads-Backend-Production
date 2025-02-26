import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
    theme?: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: ChartConfig
  children?: React.ReactNode
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <Card className={cn("p-4 w-full h-full", className)} {...props}>
      <div className="w-full h-full flex items-center justify-center">
        {children}
      </div>
    </Card>
  )
} 