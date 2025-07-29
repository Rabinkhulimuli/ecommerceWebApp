"use client"
import { useMutation, useQuery } from "@tanstack/react-query";
import { filterProductType, Product } from "@/lib/types";

export const useGetAllProduct = () => {
  const getAllProduct = async (): Promise<Product[]> => {
    const res = await fetch("/api/products");
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await res.json();
    return data.data
  };
  const {data: getAllProductData, isLoading} = useQuery<Product[], Error>({
    queryKey: ["products"],  // More generic key for potential reuse
    queryFn: getAllProduct,
    staleTime: 60 * 1000, // 1 minute before refetching
    retry: 2, // Will retry failed requests 2 times
  });

  return { getAllProductData, isLoading };
};

export const useFilterAllProduct = () => {
  const filterProduct = async ({
    price,
    category,
    page
  }: filterProductType): Promise<Product[]> => {
    const res = await fetch("/api/product/filter", {
      method: "POST",
      body: JSON.stringify({ price: price, category: category,page:page }),
    });
    if (!res.ok) {
      throw new Error("error filtering product");
    }
    const data = await res.json();
    return data.data
  };

  const { mutateAsync: filterProducts, isPending: isLoading } = useMutation({
    mutationFn: filterProduct,
    mutationKey: ["filterProduct"],
  });
  return {
    filterProducts,
    isLoading,
  };
};
