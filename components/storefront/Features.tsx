'use client'

import { BaseComponentProps } from "@/types/editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Plus, X } from "lucide-react"

interface Feature {
  id: string
  title: string
  description: string
  icon?: string
}

interface FeaturesProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  features?: Feature[]
}

export function Features({
  className,
  style,
  onUpdate,
  title = "Our Features",
  subtitle = "What makes us different",
  features = [
    { id: '1', title: 'Feature 1', description: 'Description 1' },
    { id: '2', title: 'Feature 2', description: 'Description 2' },
    { id: '3', title: 'Feature 3', description: 'Description 3' },
  ]
}: FeaturesProps) {
  const handleUpdate = (field: string, value: any) => {
    onUpdate?.({
      props: {
        [field]: value
      }
    })
  }

  const handleFeatureUpdate = (id: string, field: string, value: string) => {
    const updatedFeatures = features.map(feature =>
      feature.id === id ? { ...feature, [field]: value } : feature
    )
    handleUpdate('features', updatedFeatures)
  }

  const handleAddFeature = () => {
    const newFeature = {
      id: crypto.randomUUID(),
      title: 'New Feature',
      description: 'Feature description'
    }
    handleUpdate('features', [...features, newFeature])
  }

  const handleRemoveFeature = (id: string) => {
    handleUpdate('features', features.filter(f => f.id !== id))
  }

  return (
    <div 
      className={cn(
        "py-16 px-8",
        className
      )}
      style={style}
    >
      <div className="max-w-3xl mx-auto text-center mb-12">
        {onUpdate ? (
          <Input
            value={title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            className="text-3xl font-bold bg-transparent border-none text-center mb-4"
          />
        ) : (
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
        )}
        
        {onUpdate ? (
          <Input
            value={subtitle}
            onChange={(e) => handleUpdate('subtitle', e.target.value)}
            className="text-lg text-muted-foreground bg-transparent border-none text-center"
          />
        ) : (
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div key={feature.id} className="relative">
            {onUpdate && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2"
                onClick={() => handleRemoveFeature(feature.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <div className="p-6 bg-muted rounded-lg">
              {onUpdate ? (
                <>
                  <Input
                    value={feature.title}
                    onChange={(e) => handleFeatureUpdate(feature.id, 'title', e.target.value)}
                    className="text-xl font-semibold bg-transparent border-none mb-2"
                  />
                  <Textarea
                    value={feature.description}
                    onChange={(e) => handleFeatureUpdate(feature.id, 'description', e.target.value)}
                    className="text-muted-foreground bg-transparent border-none resize-none"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </>
              )}
            </div>
          </div>
        ))}

        {onUpdate && (
          <Button
            variant="outline"
            className="h-full min-h-[200px]"
            onClick={handleAddFeature}
          >
            <Plus className="h-8 w-8" />
          </Button>
        )}
      </div>
    </div>
  )
} 