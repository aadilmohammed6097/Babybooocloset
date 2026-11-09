import { Link, useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import styles from "./MobileCartBar.module.css";

const HIDDEN_PATHS = ["/cart", "/checkout"];

const MobileCartBar = () => {
  const { totalItems } = useCart();
  const location = useLocation();

  if (totalItems === 0 || HIDDEN_PATHS.includes(location.pathname)) {
    return null;
  }

  return (
    <Link
      to="/cart"
      className={styles.fab}
      aria-label={`View cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
    >
      <ShoppingBag size={22} />
      <span className={styles.count}>{totalItems}</span>
    </Link>
  );
};

export default MobileCartBar;
