'use client';

import CarouselModel from '../../CarouselModel';
import { useRecommendations } from '../hooks/useRecommendation';

interface RecommendationListProps {
  userId: string;
  title?: string;
  limit?: number;
}

export default function UserRecommendationList({
  userId,
  title = 'Recommended for You',
  limit = 5,
}: RecommendationListProps) {
  const { recommendations, isLoading, error, refresh, source } = useRecommendations(userId, limit);
console.log(error)

  if (error) {
    return (
      <div className='recommendation-section'>
        <h2 className='text-2xl font-semibold py-4'>{title}</h2>
        <div className='error-state'>
          <p>Failed to load recommendations</p>
          <button onClick={refresh} className='retry-button'>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className='recommendation-section'>
        <h2 className='text-2xl font-semibold py-4'>{title}</h2>
        <p>No recommendations available at this time.</p>
      </div>
    );
  }

  return (
    <div className='recommendation-section'>
      <div className='section-header'>
        <h2 className='text-2xl font-semibold py-4'>{title}</h2>
        {source && (
          <span className='source-badge'>
            {source === 'algorithm' ? 'Personalized' : 'Popular'}
          </span>
        )}
        <button onClick={refresh} className='refresh-button' title='Refresh recommendations'>
          ↻
        </button>
      </div>

      <div className='recommendation-grid'>
        <CarouselModel products={recommendations} loading={isLoading} error={error} />
      </div>
    </div>
  );
}
