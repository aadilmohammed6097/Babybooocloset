import { supabase } from "../../lib/supabase";
import type {
  AdminOrder,
  OrderInput,
  AdminOrderStatus,
  PaymentStatus,
} from "../../types";

const BASE_ORDER_SELECT = `
  *,
  order_items(*)
`;

export interface AdminOrderInput extends OrderInput {}

export async function getOrders(): Promise<AdminOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(BASE_ORDER_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AdminOrder[];
}

export async function getPendingOrders(): Promise<AdminOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(BASE_ORDER_SELECT)
    .eq("order_status", "Pending")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AdminOrder[];
}

export async function getOrderById(orderId: string): Promise<AdminOrder | null> {
  const { data, error } = await supabase
    .from("orders")
    .select(BASE_ORDER_SELECT)
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as AdminOrder | null;
}

export async function updateOrderStatus(orderId: string, status: AdminOrderStatus): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ order_status: status })
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<void> {
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

  const promises = [
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true }),
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
      .gte("created_at", `${today}T00:00:00Z`) // UTC day boundary
      .lte("created_at", `${today}T23:59:59Z`),
    supabase
      .from("orders")
      .select("total_amount", { count: "exact", head: false })
      .gte("created_at", `${today}T00:00:00Z`)
      .lte("created_at", `${today}T23:59:59Z`),
    supabase
      .from("orders")
      .select("total_amount", { count: "exact", head: false }),
  ];

  const [
    totalOrders,
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    cancelledOrders,
    todaysOrders,
    todaysRevenue,
    totalRevenue,
  ] = await Promise.all(promises);

  const todayRevenueSum = todaysRevenue.data
    ? (todaysRevenue.data as Array<{ total_amount: number }>).reduce(
        (sum, row) => sum + Number(row.total_amount ?? 0),
        0
      )
    : 0;

  const totalRevenueSum = totalRevenue.data
    ? (totalRevenue.data as Array<{ total_amount: number }>).reduce(
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
    todaysRevenue: todayRevenueSum,
    totalOrders: totalOrders.count ?? 0,
    totalRevenue: totalRevenueSum,
  };
}
