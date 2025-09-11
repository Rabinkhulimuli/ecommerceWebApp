'use client';

import { useRouter } from 'next/navigation';

export default function CatchAllError() {
  const router = useRouter();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4'>
      <h1 className='mb-4 text-4xl font-bold text-red-600'>Oops!</h1>
      <p className='mb-6 text-center text-gray-700'>The page you are looking for does not exist.</p>
      <button
        onClick={() => router.push('/')}
        className='rounded-lg bg-gray-200 px-6 py-2 text-gray-800 transition hover:bg-gray-300'
      >
        Back to Home
      </button>
    </div>
  );
}
