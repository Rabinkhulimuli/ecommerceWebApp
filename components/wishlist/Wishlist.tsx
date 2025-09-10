"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ShoppingBag, Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useWishlist } from "./hooks/useWhislist";
import { useAddToCart } from "@/services/cart.service";
import Link from "next/link";

export type WishlistItemType = {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    images: Array<{
      id: string;
      url: string;
      alt?: string;
    }>;
  };
};

export default function WishlistPage() {
  const { data } = useSession();
  const userId = data?.user.id;
  const {
    isLoading: loading,
    wishlist,
    removeFromWishlist,
  } = useWishlist(userId ?? "");
  const { addCartItem, isLoading } = useAddToCart();
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Your Wishlist
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {wishlist && wishlist.length > 0
              ? `${wishlist.length} item${
                  wishlist.length === 1 ? "" : "s"
                } waiting for you`
              : "Your wishlist is empty, but your dreams don't have to be"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {wishlist && wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start adding products you love to keep track of them and never
              miss out on your favorites.
            </p>
            <Button size="lg" className="gap-2">
              <ShoppingBag className="h-5 w-5" />
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {wishlist &&
                Array.isArray(wishlist) &&
                wishlist.map((item: WishlistItemType) => (
                  <Card
                    key={item.id}
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border bg-card"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0].url || "/placeholder.svg"}
                          alt={item.product.images[0].alt || item.product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}

                      {/* Remove Button */}
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-3 right-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => removeFromWishlist(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      {/* Wishlist Badge */}
                      <div className="absolute top-3 left-3">
                        <div className="bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Heart className="h-3 w-3 fill-current" />
                          Saved
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 leading-tight">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-primary">
                          ${Number(item.product.price).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span className="text-sm">4.5</span>
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          addCartItem({
                            userId: userId ?? "",
                            productId: item.product.id,
                          })
                        }
                        className="w-full group"
                        disabled={item.product.stock < 1}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                        {item.product?.stock > 0
                          ? isLoading
                            ? "Adding..."
                            : "Add to Cart"
                          : "Out of Stock"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Call-to-Action Section */}
            <div className="text-center py-8 border-t border-border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Ready for more?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Discover more amazing products and add them to your wishlist.
              </p>
              <Link href={"/products"}>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-transparent"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
