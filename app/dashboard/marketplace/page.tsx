import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// This would come from your backend
const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "Screen Printing Ink Set",
        price: 149.99,
        vendor: "PrintSupplies Co.",
        category: "Inks",
        image: "/mock-ink-set.jpg"
    },
    // Add more mock products as needed
]

export default async function MarketplacePage() {
    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <Input 
                    placeholder="Search products..." 
                    className="max-w-sm"
                />
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="inks">Inks</SelectItem>
                        <SelectItem value="screens">Screens</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="supplies">Supplies</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_PRODUCTS.map((product) => (
                    <Card key={product.id}>
                        <CardHeader>
                            <CardTitle>{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-square relative bg-muted rounded-lg">
                                {/* Add image here */}
                            </div>
                            <div className="mt-4 space-y-2">
                                <p className="text-2xl font-bold">${product.price}</p>
                                <p className="text-sm text-muted-foreground">Vendor: {product.vendor}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Add to Cart</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

