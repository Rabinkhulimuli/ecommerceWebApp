"use client"
import { ProductType } from "@/lib/types";
import { useState, useEffect } from "react"
export const useRecommendation = (id: string) => {
  const [recommendations, setRecommendations] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendationByProduct = async () => {
    console.log("product id for recommendation",id)
    if (!id) {
      
      return;}
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/products/recommendation/by-product?id=${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("recommendation",data)
      setRecommendations(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch recommendations when id changes
  useEffect(() => {
    getRecommendationByProduct();
  }, [id]);

  return {
    recommendations,
    loading,
    error,
    refetch: getRecommendationByProduct // Optional: manual refetch function
  };
};