'use client';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';
export default function Category() {
  const [name, setName] = useState('');
  const { toast } = useToast();
  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Category name cannot be empty',
      });
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
        setName(''); // Clear the input
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add category',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting category:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
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
        onClick={handleSubmit}
        className='mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
      >
        Submit
      </button>
    </div>
  );
}
