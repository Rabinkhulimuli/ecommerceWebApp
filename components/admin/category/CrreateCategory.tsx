'use client';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';
export default function Category() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Category name cannot be empty',
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/products/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const result = await res.json();
      console.log('Response:', result);

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Category added successfully!',
        });
        setIsLoading(false);
        setName('');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add category',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error submitting category:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-3 p-4'>
      <label htmlFor='category' className='block font-semibold'>
        Name of Category
      </label>
      <input
        type='text'
        id='category'
        placeholder='Category name'
        value={name}
        onChange={e => setName(e.target.value)}
        className='w-full rounded border border-gray-300 px-3 py-2'
      />
      <button
        type='button'
        disabled={isLoading}
        onClick={handleSubmit}
        className={`mt-2 cursor-pointer rounded bg-blue-600 px-4 py-2 text-white transition-all duration-700 ease-in-out hover:bg-blue-700 ${isLoading ? 'animate-in' : ''}`}
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
}
