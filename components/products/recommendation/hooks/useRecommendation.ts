import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useRecommendations(userId: string | null, limit = 5) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/recommendations/${userId}?limit=${limit}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 3600000, // 1 hour
    }
  );

  return {
    recommendations: data || [],
    isLoading,
    error,
    refresh: mutate
  };
}