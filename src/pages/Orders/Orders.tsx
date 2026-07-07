import { useEffect, useState } from "react";
import { Package, FileText } from "lucide-react";
import { getOrdersByUserId } from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/formatPrice";
import type { AdminOrder, AdminOrderStatus, OrderStatus } from "../../types";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import Loader from "../../components/Loader/Loader";
import Footer from "../../components/footer/Footer";
import styles from "./Orders.module.css";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};

const mapOrderStatus = (status: AdminOrderStatus): OrderStatus => {
  if (status === "Delivered") return "delivered";
  if (status === "Shipped" || status === "Out for Delivery") return "shipped";
  if (status === "Confirmed" || status === "Packed") return "processing";
  return "pending";
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      if (authLoading) return;

      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        setOrders(await getOrdersByUserId(user.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, [user, authLoading]);

  const order = orders.find((item) => item.id === selectedOrder);

  if (authLoading || loading) return <Loader />;

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>My Orders</h1>

          {error && <p className={styles.empty}>{error}</p>}

          {!error && orders.length === 0 ? (
            <p className={styles.empty}>You have no orders yet.</p>
          ) : !error ? (
            <div className={styles.list}>
              {orders.map((orderItem) => {
                const displayStatus = mapOrderStatus(orderItem.order_status);

                return (
                  <div key={orderItem.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div className={styles.orderMeta}>
                        <Package size={20} />
                        <div>
                          <p className={styles.orderId}>{orderItem.order_number}</p>
                          <p className={styles.orderDate}>
                            {new Date(orderItem.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`${styles.status} ${styles[displayStatus]}`}>
                        {statusLabels[displayStatus]}
                      </span>
                    </div>

                    <div className={styles.orderItems}>
                      {orderItem.order_items.map((item) => (
                        <div key={item.id} className={styles.orderItem}>
                          <img src={item.product_image} alt={item.product_name} />
                          <div>
                            <p className={styles.itemName}>{item.product_name}</p>
                            <p className={styles.itemMeta}>
                              {item.size} × {item.quantity}
                            </p>
                          </div>
                          <span>{formatPrice(item.line_total)}</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.orderFooter}>
                      <p className={styles.orderTotal}>
                        Total: {formatPrice(orderItem.total_amount)}
                      </p>
                      <div className={styles.orderActions}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(orderItem.id)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(orderItem.id);
                            setShowInvoice(true);
                          }}
                        >
                          <FileText size={16} />
                          Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <Modal
        isOpen={!!selectedOrder && !showInvoice}
        onClose={() => setSelectedOrder(null)}
        title="Order Details"
      >
        {order && (
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span>Order ID</span>
              <span>{order.order_number}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Date</span>
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Status</span>
              <span className={styles[mapOrderStatus(order.order_status)]}>
                {statusLabels[mapOrderStatus(order.order_status)]}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span>Total</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
            <h4 className={styles.shippingTitle}>Shipping Address</h4>
            <p className={styles.shippingInfo}>
              {`${order.first_name} ${order.last_name}`}
              <br />
              {order.address_line1}
              <br />
              {order.address_line2 && (
                <>
                  {order.address_line2}
                  <br />
                </>
              )}
              {order.city}, {order.state} {order.postal_code}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showInvoice}
        onClose={() => {
          setShowInvoice(false);
          setSelectedOrder(null);
        }}
        title="Invoice"
      >
        {order && (
          <div className={styles.invoice}>
            <p className={styles.invoiceHeader}>
              <strong>Babybooocloset</strong>
              <br />
              Invoice #{order.order_number}
              <br />
              Date: {new Date(order.created_at).toLocaleDateString()}
            </p>
            {order.order_items.map((item) => (
              <div key={item.id} className={styles.invoiceRow}>
                <span>
                  {item.product_name} ({item.size}) × {item.quantity}
                </span>
                <span>{formatPrice(item.line_total)}</span>
              </div>
            ))}
            <div className={`${styles.invoiceRow} ${styles.invoiceTotal}`}>
              <span>Total</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </>
  );
};

export default Orders;
