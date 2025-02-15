import * as React from "react"
import Link from "next/link"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

type BreadcrumbItem = {
  href: string
  label: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center gap-1.5">
            {index > 0 && (
              <BreadcrumbSeparator />
            )}
            {index === items.length - 1 ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, href, ...props }, ref) => {
  const Comp = asChild ? Slot : Link

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      href={href!}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children || <ChevronRight className="h-4 w-4" />}
  </span>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}