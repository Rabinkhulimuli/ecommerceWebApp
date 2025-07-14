import { getProducts } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

export async function ProductGrid() {
  const products = await getProducts()
  if(!products){
    return <div>product list is empty</div>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
