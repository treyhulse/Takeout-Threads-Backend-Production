import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Image, Share2, History } from "lucide-react"

export const metadata: Metadata = {
  title: "Print Shop File Management System | Takeout Threads",
  description: "Efficiently manage your artwork, embroidery files, and customer assets. Our file management system helps print shops organize and access files easily.",
  openGraph: {
    title: "Print Shop File Management System | Takeout Threads",
    description: "Efficiently manage your artwork, embroidery files, and customer assets. Our file management system helps print shops organize and access files easily.",
  }
}

export default function FileManagementPage() {
  const features = [
    {
      title: "Asset Organization",
      description: "Keep artwork, mockups, and production files organized by customer and project",
      icon: FileText
    },
    {
      title: "Design Library",
      description: "Store and categorize commonly used designs and templates",
      icon: Image
    },
    {
      title: "Easy File Sharing",
      description: "Share files securely with customers and team members",
      icon: Share2
    },
    {
      title: "Version Control",
      description: "Track file revisions and maintain design history",
      icon: History
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-[800px] mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-6">
          File Management System
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Keep your artwork, embroidery files, and customer assets organized and easily accessible. 
          Our file management system is designed specifically for print shop workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <feature.icon className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 