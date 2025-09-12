
import { Order, WishList, View, Product, User as PrismaUser, OrderItem } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library';

export type ProductType= {
  id: string;
  name: string;
  description?: string;
  price: Decimal;
  discount?: Decimal;
  images: {
    url: string;
    publicId: string;
  }[];
  categoryId: string;
  category?: string;
  rating?: number;
  reviews?: number;
  stock: number;
}
export type CartItemResponsetype = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    discount: number;
    description: string;
    images: {
      id: string;
      url: string;
      thumbnailUrl: string;
      altText: string;
    }[];
    category: string;
  };
}[];
export type UpdateCartParams = {
  userId: string;
  productId: string;
  quantity: number;
};
export interface CartItemProps {
  product: Product;
  quantity: number;
}
export interface cartItemRersponse {
  id: String;
  product: Product;
  quantity: number;
}
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  addresses?: Address[];
}


// export interface Order {
//   id: string;
//   userId: string;
//   items: Array<Product & { quantity: number }>;
//   total: number;
//   status: "pending" | "processing" | "shipped" | "delivered";
//   createdAt: Date;
//   shippingAddress: Address;
// }
export type filterProductType = {
  price?: number[];
  category?: string[];
  page?: number;
};
export type sessionUsertype = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?:string;
} | null;
export interface Address {
  id:string
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  street: string;
  postalCode: string;
  country: string;
  isPrimary:boolean
  shippingId?:string
  paymentMethod?:"CASH_ON_DELIVERY"|
  "CREDIT_CARD"|
"BANK_TRANSFER"|
  "PAYPAL"|
  "ESEWA"
}
export type getUserResType = {
  name: string;
  email: string;
  image: {
    id: string;
    url: string;
    publicId: string;
    productId: string | null;
  } | null;
  addresses: {
    id: string;
    createdAt: Date;
    orderId: string | null;
    userId: string;
    street: string;
    state: string;
    country: string;
    city: string;
    postalCode: string;
    isPrimary: boolean
  }[];
};

export interface UserWithInteractions extends PrismaUser {
  orders: Array<Order & {
    items: OrderItem[];
  }>;
  wishlists: WishList[];
  views: View[];
}

// export interface ProductWithDetails extends Product {
//   images?: any[];
//   category?: any;
// }

export interface RecommendationResult {
  products: ProductType[];
  generatedAt: Date;
  source: 'algorithm' | 'fallback';
}