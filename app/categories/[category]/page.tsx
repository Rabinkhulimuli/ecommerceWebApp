import FilterAllProduct from '@/components/products/FilterAllProduct';
import React from 'react';

type PageProps = {
  params: {
    category: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <div>
      <FilterAllProduct category={params.category} />
    </div>
  );
}
