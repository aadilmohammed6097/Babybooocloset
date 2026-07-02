import { Link } from "react-router-dom";
import Button from "../Button/Button";
import styles from "./Hero.module.css";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.heading}>Made for Tiny Giggles & Big Cuddles</h1>
        <p className={styles.subtitle}>
          Premium baby clothing for your little one.
        </p>
        <Link to="/shop">
          <Button variant="primary" size="lg">
            Shop Now
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
