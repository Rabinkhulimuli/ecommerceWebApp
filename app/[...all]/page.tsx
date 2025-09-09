"use client";

import { useRouter } from "next/navigation";

export default function CatchAllError() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
      <p className="text-gray-700 mb-6 text-center">
        The page you are looking for does not exist.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        Back to Home
      </button>
    </div>
  );
}
