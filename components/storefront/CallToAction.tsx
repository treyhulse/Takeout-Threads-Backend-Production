'use client'

import { BaseComponentProps } from "@/types/editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface CallToActionProps extends BaseComponentProps {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  align?: 'left' | 'center' | 'right'
}

export function CallToAction({
  className,
  style,
  onUpdate,
  title = "Ready to get started?",
  description = "Join thousands of satisfied customers.",
  buttonText = "Get Started",
  buttonLink = "/signup",
  align = 'center'
}: CallToActionProps) {
  const handleUpdate = (field: string, value: string) => {
    onUpdate?.({
      props: {
        [field]: value
      }
    })
  }

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <div 
      className={cn(
        "py-16 px-8 bg-muted",
        alignmentClasses[align],
        className
      )}
      style={style}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {onUpdate ? (
          <Input
            value={title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            className="text-4xl font-bold bg-transparent border-none text-center"
          />
        ) : (
          <h2 className="text-4xl font-bold">{title}</h2>
        )}
        
        {onUpdate ? (
          <Textarea
            value={description}
            onChange={(e) => handleUpdate('description', e.target.value)}
            className="text-xl text-muted-foreground bg-transparent border-none text-center resize-none"
          />
        ) : (
          <p className="text-xl text-muted-foreground">{description}</p>
        )}

        <div>
          <Button 
            size="lg" 
            asChild={!onUpdate}
            onClick={onUpdate ? () => handleUpdate('buttonText', buttonText) : undefined}
          >
            {onUpdate ? (
              <Input
                value={buttonText}
                onChange={(e) => handleUpdate('buttonText', e.target.value)}
                className="w-auto bg-transparent border-none text-center"
              />
            ) : (
              <a href={buttonLink}>{buttonText}</a>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 