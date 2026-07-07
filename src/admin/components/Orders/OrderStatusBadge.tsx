import type { OrderStatus } from "../../../types";
import styles from "../../styles/AdminShared.module.css";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  return <span className={styles.badge}>{status}</span>;
};

export default OrderStatusBadge;
