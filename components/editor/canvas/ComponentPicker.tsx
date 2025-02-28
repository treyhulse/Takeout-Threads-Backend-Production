'use client'

import { useStore } from '../StoreProvider'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ComponentType } from '@/types/editor'
import { LayoutTemplate, Type, Grid3X3, MessageSquare, ArrowRight } from 'lucide-react'

interface ComponentPickerProps {
  open: boolean
  onClose: () => void
}

interface ComponentOption {
  type: ComponentType
  label: string
  description: string
  icon: React.ReactNode
  defaultProps: Record<string, any>
}

const COMPONENT_OPTIONS: ComponentOption[] = [
  {
    type: 'hero',
    label: 'Hero Section',
    description: 'A large banner section with title, subtitle, and call-to-action.',
    icon: <LayoutTemplate className="h-6 w-6" />,
    defaultProps: {
      title: 'Welcome to our store',
      subtitle: 'Discover amazing products',
      ctaText: 'Shop Now',
      ctaLink: '/products'
    }
  },
  {
    type: 'features',
    label: 'Features Grid',
    description: 'Display your key features or services in a grid layout.',
    icon: <Grid3X3 className="h-6 w-6" />,
    defaultProps: {
      title: 'Our Features',
      subtitle: 'What makes us different',
      features: [
        { id: '1', title: 'Feature 1', description: 'Description 1' },
        { id: '2', title: 'Feature 2', description: 'Description 2' },
        { id: '3', title: 'Feature 3', description: 'Description 3' }
      ]
    }
  },
  {
    type: 'text',
    label: 'Text Content',
    description: 'Add paragraphs of text content with optional headings.',
    icon: <Type className="h-6 w-6" />,
    defaultProps: {
      title: 'Section Title',
      content: 'Add your content here...'
    }
  },
  {
    type: 'cta',
    label: 'Call to Action',
    description: 'A focused section to drive user action.',
    icon: <ArrowRight className="h-6 w-6" />,
    defaultProps: {
      title: 'Ready to get started?',
      description: 'Join thousands of satisfied customers.',
      buttonText: 'Get Started',
      buttonLink: '/signup'
    }
  }
]

export function ComponentPicker({ open, onClose }: ComponentPickerProps) {
  const { addComponent } = useStore()

  const handleSelect = (option: ComponentOption) => {
    addComponent({
      id: crypto.randomUUID(),
      type: option.type,
      props: option.defaultProps,
      styles: {}
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Component</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4 py-4">
            {COMPONENT_OPTIONS.map((option) => (
              <Button
                key={option.type}
                variant="outline"
                className="w-full justify-start p-4 h-auto"
                onClick={() => handleSelect(option)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    {option.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">{option.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 