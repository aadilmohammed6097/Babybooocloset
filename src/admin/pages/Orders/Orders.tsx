import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Pencil } from "lucide-react";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import type { AdminOrder, AdminOrderItem, AdminOrderStatus, PaymentStatus } from "../../../types";
import { ORDER_STATUSES, SORT_OPTIONS } from "../../../constants/orderConstants";
import Loader from "../../../components/Loader/Loader";
import Modal from "../../../components/Modal/Modal";
import DropdownField from "../../../components/FormFields/DropdownField";
import SearchField from "../../../components/FormFields/SearchField";
import { formatPrice } from "../../../utils/formatPrice";
import styles from "./Orders.module.css";

const statusLabelMap: Record<AdminOrderStatus, string> = {
  Pending: "Pending",
  Confirmed: "Confirmed",
  Packed: "Packed",
  Shipped: "Shipped",
  "Out for Delivery": "Out for Delivery",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
};

const paymentLabelMap: Record<PaymentStatus, string> = {
  Pending: "Pending",
  Authorized: "Authorized",
  Paid: "Paid",
  Failed: "Failed",
  Refunded: "Refunded",
};

const ACTION_ITEMS: Array<{
  label: string;
  status: AdminOrderStatus;
  allowed: AdminOrderStatus[];
}> = [
  { label: "Accept Order", status: "Confirmed", allowed: ["Pending"] },
  { label: "Pack Order", status: "Packed", allowed: ["Confirmed"] },
  { label: "Ship Order", status: "Shipped", allowed: ["Packed"] },
  { label: "Out for Delivery", status: "Out for Delivery", allowed: ["Shipped"] },
  { label: "Deliver Order", status: "Delivered", allowed: ["Out for Delivery"] },
  { label: "Cancel Order", status: "Cancelled", allowed: ["Pending", "Confirmed", "Packed"] },
];

const statusFilterOptions = [
  { label: "All Orders", value: "All" },
  ...ORDER_STATUSES.map((status) => ({ label: status, value: status })),
];

const sortFilterOptions = SORT_OPTIONS.map((option) => ({
  label: option.label,
  value: option.value,
}));

const Orders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [filter, setFilter] = useState<AdminOrderStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<(typeof SORT_OPTIONS[number])["value"]>("Newest");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeActionOrder, setActiveActionOrder] = useState<string | null>(null);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number } | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const actionAnchorRef = useRef<HTMLButtonElement | null>(null);

  const closeActionMenu = () => {
    setActiveActionOrder(null);
    setMenuCoords(null);
    actionAnchorRef.current = null;
  };

  useEffect(() => {
    if (!activeActionOrder) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        actionMenuRef.current?.contains(target) ||
        actionAnchorRef.current?.contains(target)
      ) {
        return;
      }

      closeActionMenu();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeActionMenu();
      }
    };

    const handleScrollOrResize = () => {
      closeActionMenu();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [activeActionOrder]);

  const loadOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        if (filter !== "All" && order.order_status !== filter) return false;

        const normalized = search.toLowerCase();
        return (
          order.order_number.toLowerCase().includes(normalized) ||
          `${order.first_name} ${order.last_name}`.toLowerCase().includes(normalized) ||
          order.phone.toLowerCase().includes(normalized)
        );
      })
      .sort((a, b) => {
        if (sort === "Newest") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sort === "Oldest") {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sort === "Highest") {
          return b.total_amount - a.total_amount;
        }
        if (sort === "Lowest") {
          return a.total_amount - b.total_amount;
        }
        return 0;
      });
  }, [orders, filter, search, sort]);

  const handleStatusUpdate = async (order: AdminOrder, nextStatus: AdminOrderStatus) => {
    setUpdatingOrderId(order.id);
    setError("");

    try {
      await updateOrderStatus(order.id, nextStatus);
      setOrders((prev) =>
        prev.map((item) => (item.id === order.id ? { ...item, order_status: nextStatus } : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const openDetails = (order: AdminOrder) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const toggleActionMenu = (orderId: string, button: HTMLButtonElement) => {
    if (activeActionOrder === orderId) {
      closeActionMenu();
      return;
    }

    const rect = button.getBoundingClientRect();
    const menuWidth = 210;

    actionAnchorRef.current = button;
    setMenuCoords({
      top: rect.bottom + 8,
      left: Math.max(8, rect.right - menuWidth),
    });
    setActiveActionOrder(orderId);
  };

  const isOrderLocked = (status: AdminOrderStatus) =>
    status === "Cancelled" || status === "Delivered";

  const handleActionSelect = async (order: AdminOrder, status: AdminOrderStatus) => {
    closeActionMenu();
    await handleStatusUpdate(order, status);
  };

  const activeOrder = activeActionOrder
    ? filteredOrders.find((order) => order.id === activeActionOrder) ?? null
    : null;

  if (loading) return <Loader />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Orders</h1>
          <p className={styles.subtitle}>Manage orders, update status, and review payment details.</p>
        </div>
      </div>

      <div className={styles.filters}>
        <DropdownField
          id="order-filter"
          label="Status"
          value={filter}
          options={statusFilterOptions}
          onChange={(value) => setFilter(value as AdminOrderStatus | "All")}
          className={styles.filterControl}
        />

        <DropdownField
          id="order-sort"
          label="Sort"
          value={sort}
          options={sortFilterOptions}
          onChange={(value) =>
            setSort(value as (typeof SORT_OPTIONS[number])["value"])
          }
          className={styles.filterControl}
        />

        <SearchField
          id="order-search"
          label="Search Orders"
          value={search}
          onChange={setSearch}
          placeholder="Search orders, customers or phone"
          className={styles.searchControl}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <h3 className={styles.cardHeaderTitle}>All Orders</h3>
            <p className={styles.cardHeaderCount}>{filteredOrders.length} orders</p>
          </div>
        </div>
        {filteredOrders.length === 0 ? (
          <p className={styles.empty}>No orders match the current filter or search.</p>
        ) : (
          <div className={styles.cardBody}>
            <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Payment</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th>Total</th>
                  <th>Created</th>
                  <th>Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const isMenuOpen = activeActionOrder === order.id;
                  const isUpdating = updatingOrderId === order.id;

                  return (
                  <tr
                    key={order.id}
                    className={isMenuOpen ? styles.menuOpenRow : undefined}
                  >
                    <td
                      className={styles.clickableCell}
                      onClick={() => openDetails(order)}
                    >
                      {order.order_number}
                    </td>
                    <td
                      className={styles.clickableCell}
                      onClick={() => openDetails(order)}
                    >
                      {`${order.first_name} ${order.last_name}`}
                    </td>
                    <td
                      className={styles.clickableCell}
                      onClick={() => openDetails(order)}
                    >
                      {order.phone}
                    </td>
                    <td
                      className={styles.clickableCell}
                      onClick={() => openDetails(order)}
                    >
                      {order.payment_method}
                    </td>
                    <td
                      className={styles.clickableCell}
                      onClick={() => openDetails(order)}
                    >
                      <span className={`${styles.badge} ${styles[`${order.payment_status}Badge`]}`}>
                        {paymentLabelMap[order.payment_status]}
                      </span>
                    </td>
                    <td
                      className={styles.clickableCell}
                      onClick={() => openDetails(order)}
                    >
                      <span className={`${styles.badge} ${styles[`${order.order_status.replace(/ /g, "")}Badge`]}`}>
                        {statusLabelMap[order.order_status]}
                      </span>
                    </td>
                    <td
                      className={styles.clickableCell}
                      onClick={() => openDetails(order)}
                    >
                      {formatPrice(order.total_amount)}
                    </td>
                    <td
                      className={styles.clickableCell}
                      onClick={() => openDetails(order)}
                    >
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td
                      className={styles.clickableCell}
                      onClick={() => openDetails(order)}
                    >
                      {order.order_items.length}
                    </td>
                    <td
                      className={styles.actionsCell}
                      onClick={(event) => event.stopPropagation()}
                      onMouseDown={(event) => event.stopPropagation()}
                    >
                      <div
                        className={`${styles.actionMenuWrapper} ${isMenuOpen ? styles.actionMenuOpen : ""}`}
                      >
                        <button
                          type="button"
                          className={styles.actionToggle}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            toggleActionMenu(order.id, event.currentTarget);
                          }}
                          disabled={isUpdating || isOrderLocked(order.order_status)}
                          aria-expanded={isMenuOpen}
                          aria-haspopup="menu"
                          aria-label="Edit order status"
                        >
                          <Pencil size={14} aria-hidden="true" />
                          <ChevronDown size={16} className={isMenuOpen ? styles.chevronOpen : ""} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>

      {activeOrder &&
        menuCoords &&
        createPortal(
          <div
            ref={actionMenuRef}
            className={styles.actionMenuFixed}
            style={{ top: menuCoords.top, left: menuCoords.left }}
            role="menu"
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {ACTION_ITEMS.map((item) => {
              const disabled =
                !item.allowed.includes(activeOrder.order_status) ||
                updatingOrderId === activeOrder.id;

              return (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  className={styles.actionItem}
                  disabled={disabled}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!disabled) {
                      void handleActionSelect(activeOrder, item.status);
                    }
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>,
          document.body
        )}

      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={selectedOrder ? `Order ${selectedOrder.order_number}` : "Order Details"}
      >
        {selectedOrder ? (
          <div className={styles.details}>
            <div className={styles.detailHeader}>
              <div>
                <p className={styles.caseLabel}>Order</p>
                <h2>{selectedOrder.order_number}</h2>
                <p className={styles.detailMeta}>{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <div className={styles.statusBlock}>
                <span className={`${styles.badge} ${styles[`${selectedOrder.order_status.replace(/ /g, "")}Badge`]}`}>
                  {statusLabelMap[selectedOrder.order_status]}
                </span>
                <span className={`${styles.badge} ${styles[`${selectedOrder.payment_status}Badge`]}`}>
                  {paymentLabelMap[selectedOrder.payment_status]}
                </span>
              </div>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailCard}>
                <h3>Customer</h3>
                <p className={styles.detailText}>{`${selectedOrder.first_name} ${selectedOrder.last_name}`}</p>
                <p className={styles.detailText}>{selectedOrder.email}</p>
                <p className={styles.detailText}>{selectedOrder.phone}</p>
              </div>
              <div className={styles.detailCard}>
                <h3>Shipping</h3>
                <p className={styles.detailText}>{selectedOrder.address_line1}</p>
                <p className={styles.detailText}>{selectedOrder.address_line2 || ""}</p>
                <p className={styles.detailText}>{`${selectedOrder.city}, ${selectedOrder.state}`}</p>
                <p className={styles.detailText}>{`${selectedOrder.postal_code}, ${selectedOrder.country}`}</p>
              </div>
              <div className={styles.detailCard}>
                <h3>Payment</h3>
                <p className={styles.detailText}>{selectedOrder.payment_method}</p>
                <p className={styles.detailText}>{paymentLabelMap[selectedOrder.payment_status]}</p>
              </div>
              <div className={styles.detailCard}>
                <h3>Summary</h3>
                <p className={styles.detailText}>Shipping: {selectedOrder.shipping_method}</p>
                <p className={styles.detailText}>Items: {selectedOrder.order_items.length}</p>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Products</h3>
              <div className={styles.items}>
                {selectedOrder.order_items.map((item: AdminOrderItem) => (
                  <div key={item.id} className={styles.orderItemRow}>
                    <img src={item.product_image} alt={item.product_name} />
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.product_name}</p>
                      <p className={styles.itemMeta}>{item.size}</p>
                    </div>
                    <div className={styles.priceInfo}>
                      <span>{item.quantity} × {formatPrice(item.unit_price)}</span>
                      <strong>{formatPrice(item.line_total)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.totalsPanel}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>{formatPrice(selectedOrder.shipping_charge)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Discount</span>
                <span>{formatPrice(selectedOrder.discount)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Tax</span>
                <span>{formatPrice(selectedOrder.tax)}</span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.grandTotalLabel}>Grand Total</span>
                <span className={styles.grandTotalValue}>{formatPrice(selectedOrder.total_amount)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading order details…</p>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
