'use client'

import { BaseComponentProps } from "@/types/editor"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface TextContentProps extends BaseComponentProps {
  title?: string
  content?: string
}

export function TextContent({
  className,
  style,
  onUpdate,
  title = "Section Title",
  content = "Add your content here..."
}: TextContentProps) {
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
        "py-16 px-8",
        className
      )}
      style={style}
    >
      <div className="max-w-3xl mx-auto">
        {onUpdate ? (
          <Input
            value={title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            className="text-3xl font-bold bg-transparent border-none mb-4"
          />
        ) : (
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
        )}
        
        {onUpdate ? (
          <Textarea
            value={content}
            onChange={(e) => handleUpdate('content', e.target.value)}
            className="text-lg text-muted-foreground bg-transparent border-none resize-none min-h-[200px]"
          />
        ) : (
          <div 
            className="prose prose-lg max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  )
} 