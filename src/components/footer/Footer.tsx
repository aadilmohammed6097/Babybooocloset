import { Link } from "react-router-dom";
import { Globe, Share2, Heart } from "lucide-react";
import { categories } from "../../services/mockData";
import Newsletter from "../Newsletter/Newsletter";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.brand}>
              <Link to="/" className={styles.logo}>
                Babybooocloset
              </Link>
              <p className={styles.tagline}>
                Premium baby clothing crafted with love for your little one.
              </p>
              <div className={styles.social}>
                <a href="#" aria-label="Instagram">
                  <Share2 size={20} />
                </a>
                <a href="#" aria-label="Facebook">
                  <Globe size={20} />
                </a>
                <a href="#" aria-label="Twitter">
                  <Heart size={20} />
                </a>
              </div>
            </div>

            <div className={styles.column}>
              <h4 className={styles.heading}>Quick Links</h4>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/shop">Shop</Link>
                </li>
                <li>
                  <Link to="/orders">My Orders</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.heading}>Collections</h4>
              <ul>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/shop?category=${cat.slug}`}>{cat.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.heading}>Contact</h4>
              <ul>
                <li>hello@Babybooocloset.com</li>
                <li>+1 (555) 123-4567</li>
                <li>Mon – Fri, 9am – 6pm EST</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />

      <div className={styles.copyright}>
        <div className={styles.container}>
          <p>&copy; {new Date().getFullYear()} Babybooocloset. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
