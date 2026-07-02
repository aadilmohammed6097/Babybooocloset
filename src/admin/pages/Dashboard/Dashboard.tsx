import { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { getDashboardStats } from "../../services/adminProductService";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    newArrivals: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.welcome}>
        Welcome back, {user?.email ?? "Admin"}
      </p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <span className={styles.label}>Total Products</span>
          <span className={styles.value}>{stats.totalProducts}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>Featured Products</span>
          <span className={styles.value}>{stats.featuredProducts}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>New Arrivals</span>
          <span className={styles.value}>{stats.newArrivals}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>Pending Orders</span>
          <span className={styles.value}>{stats.pendingOrders}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
