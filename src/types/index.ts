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

export type AdminOrderStatus =
  | "Pending"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type PaymentStatus =
  | "Pending"
  | "Authorized"
  | "Paid"
  | "Failed"
  | "Refunded";

export type PaymentMethod = "COD" | "Razorpay" | string;

export interface AdminOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  size: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  user_id: string | null;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  shipping_method: string;
  shipping_charge: number;
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  order_status: AdminOrderStatus;
  created_at: string;
  updated_at: string;
  order_items: AdminOrderItem[];
}

export interface OrderInput {
  user_id: string | null;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  shipping_method: string;
  shipping_charge: number;
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  payment_method: PaymentMethod;
}

export interface OrderItemInput {
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  size: string;
  quantity: number;
  unit_price: number;
  line_total: number;
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
  age_group: AgeGroup;
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
  age_group: AgeGroup;
  category_id: string;
}

export interface CategoryInput {
  name: string;
  slug: string;
  image_url?: string;
}
