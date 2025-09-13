'use client';
import React, { useState } from 'react';
import { ProductFilters } from '../product-filters';
import { ProductGrid } from '../product-grid';
import { useProducts } from '@/services/hooks/UseProduct';
import { useSearchParams } from 'next/navigation';

export default function FilterAllProduct({ category }: { category?: string }) {
  const [price, setPrice] = useState<[number, number]>([0, 5000]);
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const {
    data: products = [],
    isLoading,
    isFetching,
  } = useProducts({
    price,
    page,
    category: category ? [category] : categories,
    search: searchQuery,
  });
  console.log('searchWuery', searchQuery);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setPage(1);
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  const isDisabled = isLoading || isFetching;

  return (
    <div>
      <div className='grid gap-8 lg:grid-cols-4'>
        <aside className='lg:col-span-1'>
          <ProductFilters
            disabled={products.length === 0}
            price={price}
            setPrice={setPrice}
            categorys={categories}
            setCategories={setCategories}
            handleFilterChange={handleFilterChange}
            isLoading={isDisabled}
          />
        </aside>

        <main className='lg:col-span-3'>
          {products.length === 0 && !isDisabled ? (
            <div>No products found</div>
          ) : (
            <>
              {' '}
              <ProductGrid products={products} isLoading={isDisabled} />
            </>
          )}
          {/* */}
        </main>

        <div className='mt-6 flex gap-4'>
          <button disabled={page === 1 || isDisabled} onClick={() => handlePageChange(page - 1)}>
            Previous
          </button>
          <span>Page {page}</span>
          <button
            disabled={isDisabled || products.length === 0}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
