import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <main className='flex h-screen items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-200 px-4'>
      <div className='max-w-md rounded-2xl bg-white p-8 text-center shadow-xl'>
        <h1 className='mb-4 text-6xl font-bold text-red-600'>401</h1>
        <h2 className='mb-2 text-2xl font-semibold text-gray-800'>Unauthorized Access</h2>
        <p className='mb-6 text-gray-600'>You do not have permission to view this page.</p>
        <Link
          href='/'
          className='inline-block rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-red-700'
        >
          ⬅ Back to Homepage
        </Link>
      </div>
    </main>
  );
}
