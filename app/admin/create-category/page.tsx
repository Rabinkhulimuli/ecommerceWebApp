"use client"
import React, { useState } from 'react';

export default function Category() {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Category name cannot be empty");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/products/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const result = await res.json();
      console.log("Response:", result);

      if (res.ok) {
        alert("Category added successfully!");
        setName(""); // Clear the input
      } else {
        alert(result?.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Error submitting category:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-4 space-y-3">
      <label htmlFor="category" className="block font-semibold">
        Name of Category
      </label>
      <input
        type="text"
        id="category"
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
}
