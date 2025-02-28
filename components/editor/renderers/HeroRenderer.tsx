'use client'

import { BaseRenderer, BaseRendererProps } from './BaseRenderer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MediaLibrary } from '@/components/shared/MediaLibrary'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import useEditorStore from '@/lib/store/editor'

interface HeroContent {
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  imageUrl: string
  alignment: 'left' | 'center' | 'right'
}

export function HeroRenderer({ data, isEditing }: BaseRendererProps) {
  const { updateComponent } = useEditorStore()
  const content = data.content as HeroContent

  const [isEditable, setIsEditable] = useState(false)

  const handleContentUpdate = (updates: Partial<HeroContent>) => {
    updateComponent(data.id, {
      content: { ...content, ...updates }
    })
  }

  return (
    <BaseRenderer data={data} isEditing={isEditing}>
      <div 
        className={cn(
          "container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8",
          content.alignment === 'center' && "text-center",
          content.alignment === 'right' && "flex-row-reverse"
        )}
      >
        {/* Text Content */}
        <div className="flex-1 space-y-6">
          {isEditing && isEditable ? (
            <div className="space-y-4">
              <Input
                value={content.title}
                onChange={(e) => handleContentUpdate({ title: e.target.value })}
                placeholder="Hero Title"
                className="text-4xl font-bold"
              />
              <Textarea
                value={content.subtitle}
                onChange={(e) => handleContentUpdate({ subtitle: e.target.value })}
                placeholder="Hero Subtitle"
                className="text-xl text-muted-foreground"
              />
              <div className="flex gap-4">
                <Input
                  value={content.buttonText}
                  onChange={(e) => handleContentUpdate({ buttonText: e.target.value })}
                  placeholder="Button Text"
                />
                <Input
                  value={content.buttonLink}
                  onChange={(e) => handleContentUpdate({ buttonLink: e.target.value })}
                  placeholder="Button Link"
                />
              </div>
            </div>
          ) : (
            <div 
              className="space-y-6"
              onClick={() => isEditing && setIsEditable(true)}
            >
              <h1 className="text-4xl font-bold tracking-tight">
                {content.title || "Your Hero Title"}
              </h1>
              <p className="text-xl text-muted-foreground">
                {content.subtitle || "Your compelling subtitle goes here"}
              </p>
              {(content.buttonText || isEditing) && (
                <Button asChild>
                  <a href={content.buttonLink || "#"}>
                    {content.buttonText || "Call to Action"}
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Image */}
        <div className="flex-1">
          {isEditing ? (
            <MediaLibrary
              onSelect={(urls) => {
                if (urls.length > 0) {
                  handleContentUpdate({ imageUrl: urls[0] })
                }
              }}
            >
              <div className="relative aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                {content.imageUrl ? (
                  <img
                    src={content.imageUrl}
                    alt="Hero"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      Click to add image
                    </span>
                  </div>
                )}
              </div>
            </MediaLibrary>
          ) : content.imageUrl ? (
            <img
              src={content.imageUrl}
              alt="Hero"
              className="w-full rounded-lg"
            />
          ) : null}
        </div>
      </div>
    </BaseRenderer>
  )
} 