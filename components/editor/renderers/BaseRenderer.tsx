'use client'

import { ComponentData } from '@/types/editor'
import { cn } from '@/lib/utils'

export interface BaseRendererProps {
  data: ComponentData
  isEditing: boolean
}

export function BaseRenderer({ data, isEditing, children }: BaseRendererProps & { children: React.ReactNode }) {
  const { styles, responsive } = data

  // Combine styles based on breakpoints
  const combinedStyles = {
    ...styles,
    '@media (max-width: 768px)': responsive?.mobile,
    '@media (min-width: 769px) and (max-width: 1024px)': responsive?.tablet,
    '@media (min-width: 1025px)': responsive?.desktop,
  }

  return (
    <div
      className={cn(
        'relative w-full',
        isEditing && 'min-h-[100px]'
      )}
      style={combinedStyles as React.CSSProperties}
    >
      {children}
      {isEditing && data.isHidden && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Hidden Component</span>
        </div>
      )}
    </div>
  )
} 