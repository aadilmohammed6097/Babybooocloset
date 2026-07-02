export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  categoryId?: string;
  ageGroup: AgeGroup;
  sizes: string[];
  description: string;
  isNew?: boolean;
  isFeatured?: boolean;
  stock?: number;
  salePrice?: number | null;
}

export type CategorySlug = string;

export type AgeGroup = "0-3m" | "3-6m" | "6-12m" | "12-24m";

export interface Category {
  id: string;
  slug: string;
  title: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: CartItem[];
  total: number;
  shippingAddress: ShippingAddress;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  stock: number;
  image_url: string;
  featured: boolean;
  new_arrival: boolean;
  category_id: string | null;
  category_name?: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  stock: number;
  image_url: string;
  featured: boolean;
  new_arrival: boolean;
  category_id: string;
}

export interface CategoryInput {
  name: string;
  slug: string;
  image_url?: string;
}
