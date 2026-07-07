import Navbar from "../components/Navbar/Navbar";
import MobileCartBar from "../components/MobileCartBar/MobileCartBar";
import { Outlet, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./MainLayout.module.css";

const HIDDEN_CART_BAR_PATHS = ["/cart", "/checkout"];

const MainLayout = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const showMobileCartBar =
    totalItems > 0 && !HIDDEN_CART_BAR_PATHS.includes(location.pathname);

  return (
    <>
      <Navbar />
      <main className={`${styles.main} ${showMobileCartBar ? styles.mainWithCartBar : ""}`}>
        <Outlet />
      </main>
      <MobileCartBar />
    </>
  );
};

export default MainLayout;
