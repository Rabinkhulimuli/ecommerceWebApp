import FilterAllProduct from '@/components/products/FilterAllProduct';

export default function ProductsPage() {
  return (
    <div className='container mx-auto'>
      <div className='mb-8'>
        <h1 className='mb-4 text-3xl font-bold text-gray-900'>All Products</h1>
        <p className='text-gray-600'>Discover our complete collection of premium products</p>
      </div>

      <FilterAllProduct />
    </div>
  );
}
