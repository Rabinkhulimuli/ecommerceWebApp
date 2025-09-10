"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { useAddToCart } from "@/services/cart.service";
import { useSession } from "next-auth/react";
import Share from "./AllSocialSharing/SocialSharing";
import CircularImageSelector from "./productsubImages/CircleImage";
import { useRouter } from "next/navigation";
import CarouselModel from "./products/CarouselModel";
import { useRecommendation } from "@/hooks/useRecommendation";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0].url);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { data: session } = useSession();
  const userId = session?.user.id;
  const { toast } = useToast();
  const { addCartItem } = useAddToCart();
  const router= useRouter()
  const { recommendations, loading, error } = useRecommendation(product.id);

  const handleAddToCart = async () => {
    if (!userId) {
      toast({
        title: "You must login first",
        description: `User not found. Please login again`,
      });
      router.push("/auth/sign-in")
      return;
    }
    addCartItem({ userId, productId: product.id, quantity });
    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name.length > 40 ? product.name.slice(0, 40) + "..." : product.name}
(s) added to your cart.`,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div>
      <div className="grid lg:grid-cols-2 gap-8 xl:gap-12">
      {/* Product Images */}
      <div className="flex flex-col items-center relative">
        <div className="aspect-square w-full max-w-md md:max-w-lg rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={selectedImage || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Thumbnail Scrollable Row */}
        <div className="pt-1   flex items-end overflow-x-auto scrollbar-hide w-full justify-center">
          <CircularImageSelector
            setSelectedImage={setSelectedImage}
            images={product.images}
          />
        </div>
      </div>
      {/* Product Info */}
      <div className="space-y-6">
        {/* Category + Name */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary">{product.category}</Badge>
            <Badge variant="outline">No brand</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          {/* Ratings */}
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating || 5)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600">
              ({product.reviews || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.price && (
              <>
                <span className="text-lg text-gray-500 line-through">
                  ${Number(product.price).toFixed(2)}
                </span>
                <Badge className="bg-red-500 text-white">
                  Save $
                  {(
                    Number(product.price) -
                    (Number(product.price) * Number(product.discount)) / 100
                  ).toFixed(2)}
                </Badge>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <p
              className={`text-gray-700 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${
                isExpanded ? "h-auto" : "h-24"
              }`}
            >
              {product.description}
            </p>
            {product?.description && product?.description.length > 200 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 p-0 text-blue-600"
              >
                {isExpanded ? "View Less" : "View All"}
              </Button>
            )}
          </div>
        </div>

        {/* Quantity & Actions */}
        <div className="space-y-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <label className="font-medium">Quantity:</label>
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex  gap-1 sm:gap-4">
            <Button
              onClick={handleAddToCart}
              className="flex w-full sm:w-fit items-center gap-2"
              size="lg"
              disabled={!(product.stock > 0)}
            >
              <ShoppingCart className="h-5 w-5" />
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>

            <Button
              onClick={handleLike}
              variant="outline"
              size="lg"
              className="flex w-full sm:w-fit items-center justify-center"
            >
              <Heart
                className={`h-5 w-5 fill-current ${
                  isLiked ? "text-red-500" : "text-gray-400"
                }`}
              />
            </Button>

            <Share />
          </div>
        </div>

        {/* Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t">
          <div className="text-center">
            <Truck className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <div className="text-sm font-medium">Free Shipping</div>
            <div className="text-xs text-gray-600">On orders over $50</div>
          </div>
          <div className="text-center">
            <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <div className="text-sm font-medium">2 Year Warranty</div>
            <div className="text-xs text-gray-600">Full coverage</div>
          </div>
          <div className="text-center">
            <RotateCcw className="h-8 w-8 mx-auto text-orange-600 mb-2" />
            <div className="text-sm font-medium">30 Day Returns</div>
            <div className="text-xs text-gray-600">No questions asked</div>
          </div>
        </div>
      </div>
    </div>
{/* carousel */}
             {!loading?<CarouselModel products={recommendations}/>:<div>Loading...</div>}   
    </div>
  );
}
