'use client';

import { useState, useEffect } from 'react';
import { ProductType } from '@/lib/types';

interface UseRecommendationsResult {
  recommendations: ProductType[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  source: 'algorithm' | 'fallback' | null;
}

export function useRecommendations(userId: string | null, limit = 5): UseRecommendationsResult {
  const [recommendations, setRecommendations] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'algorithm' | 'fallback' | null>(null);

  const fetchRecommendations = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/recommendation/${userId}?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');

      const data = await response.json();
      setRecommendations(data.products);
      setSource(data.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [userId, limit]);

  return {
    recommendations,
    isLoading,
    error,
    refresh: fetchRecommendations,
    source,
  };
}
