import type { ReactNode } from "react";
import styles from "../../styles/AdminShared.module.css";

interface OrderStatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: ReactNode;
}

const OrderStatsCard = ({ title, value, description, icon }: OrderStatsCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.label}>{title}</span>
          <p className={styles.value}>{value}</p>
        </div>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
      {description && <p className={styles.subtitle}>{description}</p>}
    </div>
  );
};

export default OrderStatsCard;
