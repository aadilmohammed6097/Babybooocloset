import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import Footer from "../../components/footer/Footer";
import styles from "./Checkout.module.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "";

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.empty}>
          <h1>Order Placed Successfully</h1>
          <p>Your order number is:</p>
          <p style={{ fontWeight: 700, margin: "16px 0" }}>{orderNumber}</p>
          <Button variant="primary" size="lg" fullWidth onClick={() => navigate("/")}> 
            Continue Shopping
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
