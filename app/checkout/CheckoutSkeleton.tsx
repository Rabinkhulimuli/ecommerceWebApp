'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function CheckoutSkeleton() {
  return (
    <div className='container mx-auto animate-pulse px-4 py-8'>
      <div className='mb-8 h-8 w-40 rounded bg-gray-200' />

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Left side: form steps */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Tabs skeleton */}
          <div className='grid w-full grid-cols-3 gap-2'>
            <div className='h-10 rounded bg-gray-200' />
            <div className='h-10 rounded bg-gray-200' />
            <div className='h-10 rounded bg-gray-200' />
          </div>

          {/* Form section */}
          <div className='space-y-4'>
            <div className='h-6 w-32 rounded bg-gray-200' />
            <div className='h-12 rounded bg-gray-200' />
            <div className='h-12 rounded bg-gray-200' />

            <div className='grid grid-cols-2 gap-4'>
              <div className='h-12 rounded bg-gray-200' />
              <div className='h-12 rounded bg-gray-200' />
            </div>

            <div className='h-12 rounded bg-gray-200' />
            <div className='h-12 rounded bg-gray-200' />
          </div>

          <div className='h-12 w-32 rounded bg-gray-200' />
        </div>

        {/* Right side: order summary */}
        <div className='space-y-4 rounded-lg border border-gray-200 p-4 shadow-sm'>
          <div className='h-6 w-24 rounded bg-gray-200' />

          <div className='space-y-2'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='flex items-center space-x-4'>
                <div className='h-12 w-12 rounded bg-gray-200' />
                <div className='flex-1 space-y-2'>
                  <div className='h-4 w-2/3 rounded bg-gray-200' />
                  <div className='h-4 w-1/3 rounded bg-gray-200' />
                </div>
              </div>
            ))}
          </div>

          <div className='mt-4 space-y-2'>
            <div className='h-4 w-1/2 rounded bg-gray-200' />
            <div className='h-6 w-32 rounded bg-gray-200' />
            <div className='h-10 rounded bg-gray-200' />
          </div>
        </div>
      </div>
    </div>
  );
}
