import { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { getDashboardStats } from "../../services/adminProductService";
import { getDashboardOrderStats } from "../../services/orderService";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    newArrivals: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    todaysOrders: 0,
    todaysRevenue: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const productStats = await getDashboardStats();
      const orderStats = await getDashboardOrderStats();
      setStats({ ...productStats, ...orderStats });
    };

    loadStats();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.welcome}>Welcome back, {user?.email ?? "Admin"}</p>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.blue}`}>
          <span className={styles.kpiLabel}>Total Orders</span>
          <span className={styles.kpiValue}>{stats.totalOrders}</span>
          <span className={styles.kpiNote}>All orders received</span>
        </div>
        <div className={`${styles.kpiCard} ${styles.orange}`}>
          <span className={styles.kpiLabel}>Pending Orders</span>
          <span className={styles.kpiValue}>{stats.pendingOrders}</span>
          <span className={styles.kpiNote}>Awaiting fulfillment</span>
        </div>
        <div className={`${styles.kpiCard} ${styles.green}`}>
          <span className={styles.kpiLabel}>Delivered Orders</span>
          <span className={styles.kpiValue}>{stats.deliveredOrders}</span>
          <span className={styles.kpiNote}>Successfully delivered</span>
        </div>
        <div className={`${styles.kpiCard} ${styles.teal}`}>
          <span className={styles.kpiLabel}>Revenue</span>
          <span className={styles.kpiValue}>{stats.totalRevenue}</span>
          <span className={styles.kpiNote}>Total sales value</span>
        </div>
        <div className={`${styles.kpiCard} ${styles.blueDark}`}>
          <span className={styles.kpiLabel}>Today's Orders</span>
          <span className={styles.kpiValue}>{stats.todaysOrders}</span>
          <span className={styles.kpiNote}>Orders placed today</span>
        </div>
        <div className={`${styles.kpiCard} ${styles.greenLight}`}>
          <span className={styles.kpiLabel}>Today's Revenue</span>
          <span className={styles.kpiValue}>{stats.todaysRevenue}</span>
          <span className={styles.kpiNote}>Today's earnings</span>
        </div>
        <div className={`${styles.kpiCard} ${styles.purple}`}>
          <span className={styles.kpiLabel}>Products</span>
          <span className={styles.kpiValue}>{stats.totalProducts}</span>
          <span className={styles.kpiNote}>Active catalog items</span>
        </div>
        <div className={`${styles.kpiCard} ${styles.pink}`}>
          <span className={styles.kpiLabel}>Customers</span>
          <span className={styles.kpiValue}>{stats.totalOrders}</span>
          <span className={styles.kpiNote}>Order count proxy</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
