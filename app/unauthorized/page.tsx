
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <main className="flex h-screen items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-200 px-4">
      <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-6xl font-bold text-red-600 mb-4">401</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Unauthorized Access</h2>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow hover:bg-red-700 transition"
        >
          ⬅ Back to Homepage
        </Link>
      </div>
    </main>
  );
}
