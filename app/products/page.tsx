
import FilterAllProduct from "@/components/products/FilterAllProduct"

export default function ProductsPage() {
   
    
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
        <p className="text-gray-600">Discover our complete collection of premium products</p>
      </div>

      <FilterAllProduct/>
    </div>
  )
}
