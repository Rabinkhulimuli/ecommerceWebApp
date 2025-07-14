export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;

  discount?: number;
  images: {
    url: string;
    publicId: string;
  }[];
  categoryId: string;
  rating?: number;
  reviews?: number;
  stock: number;
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
