'use client';

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

  if (isLoading) {
    return (
      <div className='recommendation-section'>
        <h2>{title}</h2>
        <div className='loading-grid'>
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className='product-card-skeleton'>
              <div className='image-skeleton'></div>
              <div className='info-skeleton'>
                <div className='title-skeleton'></div>
                <div className='price-skeleton'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='recommendation-section'>
        <h2>{title}</h2>
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
        <h2>{title}</h2>
        <p>No recommendations available at this time.</p>
      </div>
    );
  }

  return (
    <div className='recommendation-section'>
      <div className='section-header'>
        <h2>{title}</h2>
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
        {recommendations.map(product => (
          <div key={product.id} className='product-card'>
            {product.images && product.images.length > 0 && (
              <img src={product.images[0].url} alt={product.name} className='product-image' />
            )}
            <div className='product-info'>
              <h3 className='product-name'>{product.name}</h3>
              <p className='product-price'>${product.price.toString()}</p>
              {product.category && (
                <span className='product-category'>{product.category.name}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
