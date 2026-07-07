import { supabase } from "../lib/supabase";
import { generateOrderNumber } from "../utils/orderNumber";
import type {
  CartItem,
  OrderInput,
  OrderItemInput,
  AdminOrder,
  AdminOrderStatus,
  PaymentStatus,
} from "../types";

const ORDER_SELECT = `*, order_items(*)`;

export interface CreatedOrder {
  id: string;
  order_number: string;
  [key: string]: unknown;
}

export const createOrder = async (
  order: OrderInput
): Promise<CreatedOrder> => {
  const orderNumber = generateOrderNumber();
  const payload = {
    ...order,
    order_number: orderNumber,
    payment_status: "Pending",
    order_status: "Pending",
  };

  const { data, error } = await supabase
    .from("orders")
    .insert(payload)
    .select("id, order_number")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create order.");
  }

  return { id: data.id, order_number: data.order_number };
};

export const createOrderItems = async (
  items: OrderItemInput[]
): Promise<void> => {
  const { error } = await supabase.from("order_items").insert(items);
  if (error) {
    throw new Error(error.message);
  }
};

export const placeOrder = async (
  orderInput: Omit<OrderInput, "user_id"> & { user_id: string | null },
  cartItems: CartItem[]
): Promise<CreatedOrder> => {
  const order = await createOrder(orderInput);

  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    product_image: item.product.image,
    size: item.size,
    quantity: item.quantity,
    unit_price: item.product.price,
    line_total: item.product.price * item.quantity,
  }));

  await createOrderItems(orderItems);
  return order;
};

export async function getOrdersByEmail(email: string): Promise<AdminOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("email", email)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AdminOrder[];
}

export async function getOrders(): Promise<AdminOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AdminOrder[];
}

export async function getOrderById(orderId: string): Promise<AdminOrder | null> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as AdminOrder | null;
}

export async function updateOrderStatus(
  orderId: string,
  status: AdminOrderStatus
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ order_status: status })
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updatePaymentStatus(
  orderId: string,
  status: PaymentStatus
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: status })
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getDashboardOrderStats() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const [
    totalOrders,
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    cancelledOrders,
    todaysOrders,
    todaysRevenue,
    totalRevenue,
  ] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("order_status", "Pending"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("order_status", "Confirmed"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("order_status", "Delivered"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("order_status", "Cancelled"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", `${today}T00:00:00Z`)
      .lte("created_at", `${today}T23:59:59Z`),
    supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", `${today}T00:00:00Z`)
      .lte("created_at", `${today}T23:59:59Z`),
    supabase.from("orders").select("total_amount"),
  ]);

  const todaysRevenueSum = todaysRevenue.data
    ? (todaysRevenue.data as Array<{ total_amount: number | null }>).reduce(
        (sum, row) => sum + Number(row.total_amount ?? 0),
        0
      )
    : 0;

  const totalRevenueSum = totalRevenue.data
    ? (totalRevenue.data as Array<{ total_amount: number | null }>).reduce(
        (sum, row) => sum + Number(row.total_amount ?? 0),
        0
      )
    : 0;

  return {
    pendingOrders: pendingOrders.count ?? 0,
    confirmedOrders: confirmedOrders.count ?? 0,
    deliveredOrders: deliveredOrders.count ?? 0,
    cancelledOrders: cancelledOrders.count ?? 0,
    todaysOrders: todaysOrders.count ?? 0,
    todaysRevenue: todaysRevenueSum,
    totalOrders: totalOrders.count ?? 0,
    totalRevenue: totalRevenueSum,
  };
}
