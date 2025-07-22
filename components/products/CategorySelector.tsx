'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategory = async () => {
      try {
        setLoading(true)
        const res = await fetch("http://localhost:3000/api/products/category");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    getCategory();
  }, []);

  return (
    <div className="space-y-1">
      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
        Category*
      </label>
      {loading ? (
        <p className="text-sm text-gray-500">Loading categories...</p>
      ) : categories.length > 0 ? (
        <select
        name="category"
          id="category"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id} className="capitalize">
              {category.name}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-sm text-red-500">
          No categories found. <Link href="/admin/create-category" className="underline text-blue-600">Create one</Link>
        </p>
      )}
    </div>
  );
}
