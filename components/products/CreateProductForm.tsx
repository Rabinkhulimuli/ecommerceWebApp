'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';
import CategorySelector from './CategorySelector';
import { useToast } from '../ui/use-toast';

export default function CreateProductForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const initialState = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
    images: [] as File[],
    discount: 0,
  };
  const [productData, setProductData] = useState(initialState);
  const { toast } = useToast();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (files: File[]) => {
    setProductData(prev => ({
      ...prev,
      images: files,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('categoryId', productData.categoryId);
      formData.append('stock', productData.stock.toString());
      formData.append('discount', productData.discount.toString());

      productData.images.forEach((file, index) => {
        formData.append(`images`, file);
      });
      const response = await fetch('http://localhost:3000/api/products/create-product', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Successfully items created',
        });
        setProductData(initialState);
        setResetKey(prev => prev + 1);
      } else {
        toast({
          title: 'Error',
          description: 'items failed to create',
          variant: 'destructive',
        });
        throw new Error('Failed to create product');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'failed to create items',
        variant: 'destructive',
      });
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='mx-auto max-w-4xl px-4 py-8'>
      <div className='overflow-hidden rounded-xl bg-white shadow-md'>
        <div className='p-6 md:p-8'>
          <h1 className='mb-6 text-nowrap text-xl font-bold text-gray-800 sm:text-2xl'>
            Create New Product
          </h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Basic Information Section */}
            <div className='space-y-4'>
              <h2 className='font-semibold text-gray-700 sm:text-lg'>Basic Information</h2>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {/* Product Name */}
                <div className='space-y-1'>
                  <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                    Product Name*
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    required
                    value={productData.name}
                    onChange={handleChange}
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500'
                  />
                </div>

                {/* Category */}
                <CategorySelector
                  value={productData.categoryId}
                  onChange={value => setProductData(prev => ({ ...prev, categoryId: value }))}
                />
              </div>

              {/* Description */}
              <div className='space-y-1'>
                <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
                  Description*
                </label>
                <textarea
                  id='description'
                  name='description'
                  rows={4}
                  required
                  value={productData.description}
                  onChange={handleChange}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500'
                />
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                {/* Price */}
                <div className='space-y-1'>
                  <label htmlFor='price' className='block text-sm font-medium text-gray-700'>
                    Price*
                  </label>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500'>
                      $
                    </span>
                    <input
                      type='number'
                      id='price'
                      name='price'
                      required
                      value={productData.price}
                      onChange={handleChange}
                      className='w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className='space-y-1'>
                  <label htmlFor='stock' className='block text-sm font-medium text-gray-700'>
                    Stock Quantity*
                  </label>
                  <input
                    type='number'
                    id='stock'
                    name='stock'
                    min='0'
                    required
                    value={productData.stock}
                    onChange={handleChange}
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500'
                  />
                </div>
                {/* discount */}
                <div className='space-y-1'>
                  <label htmlFor='discount' className='block text-sm font-medium text-gray-700'>
                    Discount %*
                  </label>
                  <div className='relative'>
                    <input
                      type='number'
                      min='0'
                      max='100'
                      name='discount'
                      id='discount'
                      required
                      value={productData.discount}
                      onChange={handleChange}
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className='sm:space-y-4'>
              <h2 className='text-lg font-semibold text-gray-700'>Product Images</h2>
              <ImageUploader key={resetKey} onUpload={handleImageUpload} />
            </div>

            {/* Form Actions */}
            <div className='flex flex-col items-center gap-2 border-t border-gray-200 py-4 sm:flex-row sm:justify-end sm:space-x-3'>
              <button
                type='button'
                onClick={() => router.push('/products')}
                className='w-full rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:bg-blue-400'
              >
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
