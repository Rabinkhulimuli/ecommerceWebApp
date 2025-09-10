import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ProductCard } from "../product-card";
import { Product } from "@/lib/types";

export default function CarouselModel({
  products,
  loading,
  error,
}: {
  products: Product[];
  loading: boolean;
  error: string|null;
}) {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
      slidesToSlide: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 2,
    },
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="animate-pulse flex flex-col items-center p-4 rounded-xl border shadow-sm bg-gray-100 h-64">
      <div className="w-32 h-32 bg-gray-300 rounded-md mb-4" />
      <div className="w-24 h-4 bg-gray-300 rounded mb-2" />
      <div className="w-16 h-4 bg-gray-200 rounded" />
    </div>
  );

  if (loading) {
    return (
      <div className="top-selling-carousel">
        <Carousel
          responsive={responsive}
          autoPlay={false}
          infinite={false}
          keyBoardControl={false}
          removeArrowOnDeviceType={["mobile"]}
          itemClass="carousel-item-padding-40-px"
          containerClass="carousel-container"
        >
          {Array.from({ length: 5 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </Carousel>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">⚠ {error}</div>;
  }

  if (!products || products.length <= 0) {
    return <div>There are no recommendations</div>;
  }

  return (
    <div>
      <Carousel
        responsive={responsive}
        autoPlay={true}
        autoPlaySpeed={3000}
        infinite={true}
        keyBoardControl={true}
        removeArrowOnDeviceType={["mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
        containerClass="carousel-container"
      >
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <ProductCard product={product} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
