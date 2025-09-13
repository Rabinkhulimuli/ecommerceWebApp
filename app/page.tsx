'use client';
import { Suspense } from 'react';
import { ProductGrid } from '@/components/product-grid';
import { HeroSection } from '@/components/hero-section';
import { FeaturedCategories } from '@/components/featured-categories';
import { ProductGridSkeleton } from '@/components/product-grid-skeleton';
import { useProducts } from '@/services/hooks/UseProduct';

export default function HomePage() {
  const { isLoading, data: products = [] } = useProducts();

  const hasProducts = products.length > 0;

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
          {hasProducts ? (
            <ProductGrid products={products} isLoading={isLoading} />
          ) : (
            <div className='flex flex-col items-center justify-center py-12 text-gray-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='mb-4 h-16 w-16 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 3h18v18H3V3z'
                />
              </svg>
              <p className='text-lg font-medium'>No products found</p>
              <p className='text-sm text-gray-400'>Check back later for new arrivals!</p>
            </div>
          )}
        </Suspense>
      </section>
    </div>
  );
}
