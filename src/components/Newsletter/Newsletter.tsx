import { useState } from "react";
import Button from "../Button/Button";
import styles from "./Newsletter.module.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Join Our Newsletter</h2>
        <p className={styles.subtitle}>
          Be the first to know about new arrivals, exclusive offers, and styling
          tips for your little one.
        </p>
        {submitted ? (
          <p className={styles.success}>
            Thank you for subscribing! Welcome to the Babybooocloset family.
          </p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <Button type="submit" variant="primary">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
