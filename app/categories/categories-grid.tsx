import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { getCategoriesWithProducts } from "@/services/category.service"

export async function CategoriesGrid() {
  const categories = await getCategoriesWithProducts()

  if (!categories || categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-medium">No categories available</h3>
        <p className="mt-2 text-muted-foreground">
          Our collections are currently being prepared. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <div key={category.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{category.name}</h2>
            <Button asChild variant="ghost" className="group">
              <Link href={`/category/${category.id}`}>
                View all
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
