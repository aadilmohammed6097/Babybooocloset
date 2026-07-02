import { useState } from "react";
import { Package, FileText } from "lucide-react";
import { orders } from "../../services/mockData";
import { formatPrice } from "../../utils/formatPrice";
import type { OrderStatus } from "../../types";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import Footer from "../../components/footer/Footer";
import styles from "./Orders.module.css";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const order = orders.find((o) => o.id === selectedOrder);

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>My Orders</h1>

          {orders.length === 0 ? (
            <p className={styles.empty}>You have no orders yet.</p>
          ) : (
            <div className={styles.list}>
              {orders.map((orderItem) => (
                <div key={orderItem.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderMeta}>
                      <Package size={20} />
                      <div>
                        <p className={styles.orderId}>{orderItem.id}</p>
                        <p className={styles.orderDate}>{orderItem.date}</p>
                      </div>
                    </div>
                    <span
                      className={`${styles.status} ${styles[orderItem.status]}`}
                    >
                      {statusLabels[orderItem.status]}
                    </span>
                  </div>

                  <div className={styles.orderItems}>
                    {orderItem.items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.size}`}
                        className={styles.orderItem}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                        />
                        <div>
                          <p className={styles.itemName}>{item.product.name}</p>
                          <p className={styles.itemMeta}>
                            {item.size} × {item.quantity}
                          </p>
                        </div>
                        <span>
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.orderFooter}>
                    <p className={styles.orderTotal}>
                      Total: {formatPrice(orderItem.total)}
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
              ))}
            </div>
          )}
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
              <span>{order.id}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Date</span>
              <span>{order.date}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Status</span>
              <span className={styles[order.status]}>
                {statusLabels[order.status]}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <h4 className={styles.shippingTitle}>Shipping Address</h4>
            <p className={styles.shippingInfo}>
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
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
              Invoice #{order.id}
              <br />
              Date: {order.date}
            </p>
            {order.items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className={styles.invoiceRow}>
                <span>
                  {item.product.name} ({item.size}) × {item.quantity}
                </span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className={`${styles.invoiceRow} ${styles.invoiceTotal}`}>
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </>
  );
};

export default Orders;
