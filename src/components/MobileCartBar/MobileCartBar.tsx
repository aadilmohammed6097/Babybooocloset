import { Link, useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";
import styles from "./MobileCartBar.module.css";

const HIDDEN_PATHS = ["/cart", "/checkout"];

const MobileCartBar = () => {
  const { totalItems, totalPrice } = useCart();
  const location = useLocation();

  if (totalItems === 0 || HIDDEN_PATHS.includes(location.pathname)) {
    return null;
  }

  return (
    <div className={styles.bar} role="status" aria-live="polite">
      <div className={styles.info}>
        <span className={styles.iconWrap}>
          <ShoppingBag size={18} />
          <span className={styles.count}>{totalItems}</span>
        </span>
        <div className={styles.text}>
          <span className={styles.label}>
            {totalItems} item{totalItems !== 1 ? "s" : ""} in cart
          </span>
          <span className={styles.total}>{formatPrice(totalPrice)}</span>
        </div>
      </div>
      <Link to="/cart" className={styles.cta}>
        View Cart
      </Link>
    </div>
  );
};

export default MobileCartBar;
