import { Product } from "@/lib/types";

type ProductFilters = {
  price?: [number, number];
  category?: string[];
  page?: number;
};
export const filterProducts=async(filters?: ProductFilters): Promise<Product[]>=> {
  const queryKey = filters 
    ? ['products', filters] 
    : ['products'];
  
    let url = '/api/products/filter';
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.price) {
        params.append('minPrice', filters.price[0].toString());
        params.append('maxPrice', filters.price[1].toString());
      }
      if (filters.category?.length) {
        params.append('category', filters.category.join(','));
      }
      if (filters.page) {
        params.append('page', filters.page.toString());
      }
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log("data from service ",data)
    return data.data ?? [];

}