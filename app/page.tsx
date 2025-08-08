"use client"
import { Suspense } from "react"
import { ProductGrid } from "@/components/product-grid"
import { HeroSection } from "@/components/hero-section"
import { FeaturedCategories } from "@/components/featured-categories"
import { ProductGridSkeleton } from "@/components/product-grid-skeleton"
import { useProducts } from "@/services/hooks/UseProduct"

export default function HomePage() {
  const { isLoading,data: products=[] } = useProducts()
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedCategories />
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of premium products
          </p>
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
          {products? <ProductGrid products={products} isLoading={isLoading} />:<div className="text-center text-gray-500">No products available</div> }
        </Suspense>
      </section>
    </div>
  )
}
