
import { useQuery } from "@tanstack/react-query";
import { ProductType } from "@/lib/types";
import { filterProducts } from "../product.service";

type ProductFilters = {
  price?: [number, number];
  category?: string[];
  page?: number;
  search?:string
};

export const useProducts = (filters?: ProductFilters) => {
  
  return useQuery<ProductType[], Error>({
    queryKey:['allProducts',filters],
    queryFn:()=>  {
        return filterProducts(filters)
        .then(data => data)
        .catch(error => {
          throw new Error(error.message);
        });
    },
    staleTime: 60 * 5000, // 1 minute cache
    retry: 2,
  });
};