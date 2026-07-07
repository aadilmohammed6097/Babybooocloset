import type { AdminOrderStatus, PaymentStatus } from "../types";

export const ORDER_STATUSES: AdminOrderStatus[] = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export const PAYMENT_STATUSES: PaymentStatus[] = [
  "Pending",
  "Authorized",
  "Paid",
  "Failed",
  "Refunded",
];

export const ORDER_STATUS_TRANSITIONS: Record<AdminOrderStatus, AdminOrderStatus | null> = {
  Pending: "Confirmed",
  Confirmed: "Packed",
  Packed: "Shipped",
  Shipped: "Out for Delivery",
  "Out for Delivery": "Delivered",
  Delivered: null,
  Cancelled: null,
};

export const SORT_OPTIONS = [
  { value: "Newest", label: "Newest First" },
  { value: "Oldest", label: "Oldest First" },
  { value: "Highest", label: "Highest Amount" },
  { value: "Lowest", label: "Lowest Amount" },
] as const;
