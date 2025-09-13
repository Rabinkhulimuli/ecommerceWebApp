import { ProductCard } from '@/components/product-card';
import { ProductType } from '@/lib/types';
import { ProductGridSkeleton } from './product-grid-skeleton';

export function ProductGrid({
  products,
  isLoading,
}: {
  products: ProductType[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return <ProductGridSkeleton />;
  }
  if (!products) {
    return <div>No product found</div>;
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
