'use client'

import { BaseComponentProps } from "@/types/editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface HeroProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: string
}

export function Hero({
  className,
  style,
  onUpdate,
  title = "Welcome to our store",
  subtitle = "Discover amazing products",
  ctaText = "Shop Now",
  ctaLink = "/products",
  backgroundImage,
}: HeroProps) {
  const handleUpdate = (field: string, value: string) => {
    onUpdate?.({
      props: {
        [field]: value
      }
    })
  }

  return (
    <div 
      className={cn(
        "relative min-h-[400px] flex items-center justify-center text-center p-8",
        className
      )}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...style
      }}
    >
      <div className="relative z-10 max-w-3xl mx-auto space-y-4">
        {onUpdate ? (
          <Input
            value={title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            className="text-4xl font-bold bg-transparent border-none text-center"
          />
        ) : (
          <h1 className="text-4xl font-bold">{title}</h1>
        )}
        
        {onUpdate ? (
          <Input
            value={subtitle}
            onChange={(e) => handleUpdate('subtitle', e.target.value)}
            className="text-xl text-muted-foreground bg-transparent border-none text-center"
          />
        ) : (
          <p className="text-xl text-muted-foreground">{subtitle}</p>
        )}

        <Button 
          size="lg" 
          asChild={!onUpdate}
          onClick={onUpdate ? () => handleUpdate('ctaText', ctaText) : undefined}
        >
          {onUpdate ? (
            <Input
              value={ctaText}
              onChange={(e) => handleUpdate('ctaText', e.target.value)}
              className="w-auto bg-transparent border-none text-center"
            />
          ) : (
            <a href={ctaLink}>{ctaText}</a>
          )}
        </Button>
      </div>
    </div>
  )
} 