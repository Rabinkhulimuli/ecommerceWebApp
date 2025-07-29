"use client";
import React, { Suspense, useEffect, useState } from "react";
import { ProductFilters } from "../product-filters";
import { ProductGridSkeleton } from "../product-grid-skeleton";
import { ProductGrid } from "../product-grid";
import {
  useFilterAllProduct,
  useGetAllProduct,
} from "@/services/product.service";
import { Product } from "@/lib/types";

export default function FilterAllProduct() {
  const [allProduct, setAllProduct] = useState<Product[]>([]);
  const [price, setPrice] = useState([0, 5000]);
  const [page, setPage] = useState(1);
  const [categorys, setCategories] = useState<string[]>([]);
  const { filterProducts, isLoading: isLoadingfilter } = useFilterAllProduct();
  const { getAllProductData: products, isLoading } = useGetAllProduct();
  useEffect(() => {
    if (products) setAllProduct(products);
  }, [products]);
  if (!allProduct) {
    return <div>product list is empty</div>;
  }
  const handleFilterChange = async () => {
    try {
      const productData = await filterProducts({ price, category: categorys,page });
      setAllProduct(productData);
    } catch (err) {
      console.error("Error filtering products", err);
    }
  };
  return (
    <div>
      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ProductFilters
            price={price}
            setPrice={setPrice}
            categorys={categorys}
            setCategories={setCategories}
            handleFilterChange={handleFilterChange}
            isLoading={isLoadingfilter}
          />
        </aside>

        <main className="lg:col-span-3">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={allProduct} isLoading={isLoading} />
          </Suspense>
        </main>
        <div className="flex gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => {
              setPage((prev) => prev - 1);
              handleFilterChange();
            }}
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => {
              setPage((prev) => prev + 1);
              handleFilterChange();
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
