import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Truck } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../services/customerProfileService";
import { lookupIndianPincode } from "../../services/pincodeService";
import { formatPrice } from "../../utils/formatPrice";
import { generateOrderNumber } from "../../utils/orderNumber";
import { startPayment } from "../../services/paymentService";
import {
  COUNTRY_OPTIONS,
  STATE_OPTIONS,
} from "../../constants/locationOptions";
import Button from "../../components/Button/Button";
import DropdownField from "../../components/FormFields/DropdownField";
import Footer from "../../components/footer/Footer";
import styles from "./Checkout.module.css";

const SHIPPING_CHARGE = 60;

interface CheckoutFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const Checkout = () => {
  // const navigate = useNavigate();
  const { items, totalPrice,  } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState<CheckoutFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState("");

  useEffect(() => {
    const prefillForm = async () => {
      if (!user) return;

      try {
        const profile = await getProfile(user.id);
        setForm((prev) => ({
          ...prev,
          firstName: profile?.first_name ?? prev.firstName,
          lastName: profile?.last_name ?? prev.lastName,
          email: user.email,
          phone: profile?.phone ?? prev.phone,
        }));
      } catch {
        setForm((prev) => ({ ...prev, email: user.email }));
      }
    };

    void prefillForm();
  }, [user]);

  useEffect(() => {
    const pincode = form.postalCode.trim();

    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus("");
      return;
    }

    let cancelled = false;

    const lookup = async () => {
      setPincodeStatus("Looking up pin code...");

      try {
        const result = await lookupIndianPincode(pincode);

        if (cancelled) return;

        if (!result) {
          setPincodeStatus("Pin code not found. Please select state manually.");
          return;
        }

        setForm((prev) => ({
          ...prev,
          city: result.city || prev.city,
          state: result.state || prev.state,
          country: result.country || "India",
        }));
        setPincodeStatus("Location filled from pin code.");
      } catch {
        if (!cancelled) {
          setPincodeStatus("Could not look up pin code. Please select manually.");
        }
      }
    };

    void lookup();

    return () => {
      cancelled = true;
    };
  }, [form.postalCode]);

  const shippingCharge = SHIPPING_CHARGE;
  const discount = 0;
  const tax = Math.round((totalPrice + shippingCharge - discount) * 0.05);
  const totalAmount = totalPrice + shippingCharge - discount + tax;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const nextValue =
      name === "postalCode" ? value.replace(/\D/g, "").slice(0, 6) : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!form.state) {
      setError("Please select a state.");
      return;
    }

    if (!form.country) {
      setError("Please select a country.");
      return;
    }

    const orderNumber = generateOrderNumber();
  
    setLoading(true);
  
    try {
      const razorpayOrder = await startPayment(
        totalAmount,
        orderNumber
      );
  
      console.log("Razorpay Order");
  
      console.log(razorpayOrder);
  
      // Stop here for now.
      // Next step will open Razorpay Checkout.
  
      return;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to initialize payment."
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
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
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
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
                  name="addressLine1"
                  placeholder="Address Line 1"
                  value={form.addressLine1}
                  onChange={handleChange}
                  required
                  className={`${styles.input} ${styles.fullWidth}`}
                />
                <input
                  name="addressLine2"
                  placeholder="Address Line 2"
                  value={form.addressLine2}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.fullWidth}`}
                />
                <input
                  name="postalCode"
                  placeholder="Pin Code"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                  inputMode="numeric"
                  maxLength={6}
                  className={styles.input}
                />
                <input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
                <DropdownField
                  value={form.state}
                  options={[...STATE_OPTIONS]}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, state: value }))
                  }
                  searchable
                  searchPlaceholder="Search state..."
                  className={styles.dropdownField}
                />
                <DropdownField
                  value={form.country}
                  options={[...COUNTRY_OPTIONS]}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, country: value }))
                  }
                  searchable
                  searchPlaceholder="Search country..."
                  className={styles.dropdownField}
                />
                {pincodeStatus && (
                  <p className={styles.pincodeStatus}>{pincodeStatus}</p>
                )}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <CreditCard size={20} />
                <h2>Payment</h2>
              </div>
              <p className={styles.paymentNote}>
                Pay securely online with Razorpay.
              </p>
              <p className={styles.shippingNote}>
                Standard shipping: {formatPrice(SHIPPING_CHARGE)}
              </p>
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
              <span>Discount</span>
              <span>{formatPrice(discount)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{formatPrice(shippingCharge)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </aside>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
