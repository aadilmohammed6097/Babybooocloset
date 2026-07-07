import type { PaymentStatus } from "../../../types";
import styles from "../../styles/AdminShared.module.css";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  return <span className={styles.badge}>{status}</span>;
};

export default PaymentStatusBadge;
