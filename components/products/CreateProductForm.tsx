'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';
import CategorySelector from './CategorySelector';
import { useToast } from '../ui/use-toast';

export default function CreateProductForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
    images: [] as File[]
  });
const {toast}=useToast()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (files:File[]) => {
    setProductData(prev => ({
      ...prev,
      images: files
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData= new FormData()
      formData.append('name',productData.name)
      formData.append('description',productData.description)
      formData.append('price',productData.price.toString())
      formData.append('categoryId',productData.categoryId)
      formData.append('stock',productData.stock.toString())

      productData.images.forEach((file,index)=> {
        formData.append(`images`,file)
      })
      const response = await fetch('http://localhost:3000/api/products/create-product', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title:"Success",
          description:"Successfully items created"
        })
        console.log(response.json())
        router.push('/products');
      } else {
         toast({
          title:"Error",
          description:"items failed to create"
        })
        throw new Error('Failed to create product');
      }
    } catch (error) {
       toast({
          title:"Error",
          description:error?.message||"failed to create items"
        })
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Product</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={productData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Category */}
                <CategorySelector 
                  value={productData.categoryId}
                  onChange={(value) => setProductData(prev => ({ ...prev, categoryId: value }))}
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={productData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-1">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price*
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      
          
                      required
                      value={productData.price}
                      onChange={handleChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className="space-y-1">
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Stock Quantity*
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    min="0"
                    required
                    value={productData.stock}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Product Images</h2>
              <ImageUploader onUpload={handleImageUpload} />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
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