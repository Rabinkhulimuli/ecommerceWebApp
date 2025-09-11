'use client';
import { Suspense } from 'react';
import { ProductGrid } from '@/components/product-grid';
import { HeroSection } from '@/components/hero-section';
import { FeaturedCategories } from '@/components/featured-categories';
import { ProductGridSkeleton } from '@/components/product-grid-skeleton';
import { useProducts } from '@/services/hooks/UseProduct';

export default function HomePage() {
  const { isLoading, data: products = [] } = useProducts();
  return (
    <div className='min-h-screen'>
      <HeroSection />
      <FeaturedCategories />
      <section className='mx-auto max-w-7xl px-4 py-16'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>Featured Products</h2>
          <p className='mx-auto max-w-2xl text-gray-600'>
            Discover our carefully curated selection of premium products
          </p>
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
          {products ? (
            <ProductGrid products={products} isLoading={isLoading} />
          ) : (
            <div className='text-center text-gray-500'>No products available</div>
          )}
        </Suspense>
      </section>
    </div>
  );
}
