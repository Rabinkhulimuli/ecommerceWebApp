// app/categories/page.tsx
import { Suspense } from "react"
import { CategoriesHero } from "./category-hero"
import { CategoriesGrid } from "./categories-grid"
import { CategoriesLoading } from "./categories-loading"

export const metadata = {
  title: "Shop by Category | Acme Store",
  description: "Browse all categories and discover a curated selection of products.",
}

export default function CategoriesPage() {
  return (
    <main className="min-h-screen">
      <CategoriesHero />
      
      <section className="mx-auto max-w-7xl px-6 pb-24 sm:pb-32 lg:px-8">
        <Suspense fallback={<CategoriesLoading />}>
          <CategoriesGrid />
        </Suspense>
      </section>
    </main>
  )
}