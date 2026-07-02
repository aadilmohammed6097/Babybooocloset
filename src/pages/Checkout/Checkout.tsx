import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, Truck } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import Footer from "../../components/footer/Footer";
import styles from "./Checkout.module.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    setShowSuccess(true);
  };

  if (items.length === 0 && !showSuccess) {
    return (
      <>
        <div className={styles.empty}>
          <h2>Nothing to checkout</h2>
          <Link to="/shop">
            <Button variant="primary">Go to Shop</Button>
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
          <h1 className={styles.title}>Checkout</h1>

          <form className={styles.layout} onSubmit={handleSubmit}>
            <div className={styles.forms}>
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <Truck size={20} />
                  <h2>Shipping Address</h2>
                </div>
                <div className={styles.formGrid}>
                  <input
                    name="fullName"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                  <input
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                  <input
                    name="address"
                    placeholder="Street Address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className={`${styles.input} ${styles.fullWidth}`}
                  />
                  <input
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                  <input
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                  <input
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={form.zipCode}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>
              </section>

              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <CreditCard size={20} />
                  <h2>Payment Method</h2>
                </div>
                <div className={styles.paymentOptions}>
                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    Credit / Debit Card
                  </label>
                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                    />
                    PayPal
                  </label>
                </div>
              </section>
            </div>

            <aside className={styles.summary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <div className={styles.items}>
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className={styles.summaryItem}
                  >
                    <img src={item.product.image} alt={item.product.name} />
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
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <Button type="submit" variant="primary" size="lg" fullWidth>
                Place Order
              </Button>
            </aside>
          </form>
        </div>
      </div>

      <Modal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate("/orders");
        }}
        title="Order Placed!"
      >
        <p className={styles.successText}>
          Thank you for your order! You will receive a confirmation email
          shortly.
        </p>
        <Button
          variant="primary"
          fullWidth
          onClick={() => {
            setShowSuccess(false);
            navigate("/orders");
          }}
        >
          View Orders
        </Button>
      </Modal>

      <Footer />
    </>
  );
};

export default Checkout;
