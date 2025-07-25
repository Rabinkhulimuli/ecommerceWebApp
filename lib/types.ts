export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  images: {
    url: string;
    publicId: string;
  }[];
  categoryId: string;
  category?:string;
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
    description:string;
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
export interface  CartItemProps {
  product:Product;
  quantity:number
}
export interface cartItemRersponse{
  id:String;
  product:Product
  quantity:number
}
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<Product & { quantity: number }>;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: Date;
  shippingAddress: Address;
}

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
