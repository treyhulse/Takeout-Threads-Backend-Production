'use client'

import { BaseComponentProps } from "@/types/editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: number
  image: string
  link: string
}

interface ProductGridProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  products?: Product[]
  columns?: 2 | 3 | 4
}

export function ProductGrid({
  className,
  style,
  onUpdate,
  title = "Featured Products",
  subtitle = "Check out our latest products",
  products = [
    { id: '1', name: 'Product 1', price: 99.99, image: '/placeholder.png', link: '/products/1' },
    { id: '2', name: 'Product 2', price: 149.99, image: '/placeholder.png', link: '/products/2' },
    { id: '3', name: 'Product 3', price: 199.99, image: '/placeholder.png', link: '/products/3' },
    { id: '4', name: 'Product 4', price: 299.99, image: '/placeholder.png', link: '/products/4' },
  ],
  columns = 4
}: ProductGridProps) {
  const handleUpdate = (field: string, value: any) => {
    onUpdate?.({
      props: {
        [field]: value
      }
    })
  }

  const handleProductUpdate = (id: string, field: string, value: any) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    )
    handleUpdate('products', updatedProducts)
  }

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div 
      className={cn(
        "py-16 px-8",
        className
      )}
      style={style}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
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

        <div className={cn("grid gap-8", gridCols[columns])}>
          {products.map((product) => (
            <div key={product.id} className="group">
              <a 
                href={product.link}
                className="block aspect-square overflow-hidden rounded-lg bg-muted"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </a>
              <div className="mt-4">
                {onUpdate ? (
                  <>
                    <Input
                      value={product.name}
                      onChange={(e) => handleProductUpdate(product.id, 'name', e.target.value)}
                      className="font-medium bg-transparent border-none"
                    />
                    <Input
                      type="number"
                      value={product.price}
                      onChange={(e) => handleProductUpdate(product.id, 'price', parseFloat(e.target.value))}
                      className="text-sm text-muted-foreground bg-transparent border-none"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${product.price.toFixed(2)}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 