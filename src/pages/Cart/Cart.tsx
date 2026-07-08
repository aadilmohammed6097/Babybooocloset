import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";
import Button from "../../components/Button/Button";
import Footer from "../../components/footer/Footer";
import styles from "./Cart.module.css";

const SHIPPING_CHARGE = 60;

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <>
        <div className={styles.empty}>
          <ShoppingBag size={48} strokeWidth={1.5} />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven&apos;t added anything yet.</p>
          <Link to="/shop">
            <Button variant="primary" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Shopping Cart</h1>

          <div className={styles.layout}>
            <div className={styles.items}>
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className={styles.item}
                >
                  <Link
                    to={`/product/${item.product.id}`}
                    className={styles.itemImage}
                  >
                    <img src={item.product.image} alt={item.product.name} />
                  </Link>

                  <div className={styles.itemInfo}>
                    <Link
                      to={`/product/${item.product.id}`}
                      className={styles.itemName}
                    >
                      {item.product.name}
                    </Link>
                    <p className={styles.itemSize}>Size: {item.size}</p>
                    <p className={styles.itemPrice}>
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantity}>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      className={styles.removeBtn}
                      onClick={() =>
                        removeFromCart(item.product.id, item.size)
                      }
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <p className={styles.itemTotal}>
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <aside className={styles.summary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{formatPrice(SHIPPING_CHARGE)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>{formatPrice(totalPrice + SHIPPING_CHARGE)}</span>
              </div>
              <Link to="/checkout">
                <Button variant="primary" size="lg" fullWidth>
                  Proceed to Checkout
                </Button>
              </Link>
              <Link to="/shop" className={styles.continueLink}>
                Continue Shopping
              </Link>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
