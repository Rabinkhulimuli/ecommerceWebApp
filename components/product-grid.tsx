"use client"
import { ProductCard } from "@/components/product-card"
import { useGetAllProduct } from "@/services/product.service"

export async function ProductGrid() {
  
  const {getAllProductData:products,isLoading}= useGetAllProduct()
  if(isLoading)
    return <div>loading...</div>
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
