import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();

  const links = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Contact", path: "/contact" },
    { name: "My Orders", path: "/orders" },
  ];

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Babybooocloset
        </Link>

        <nav className={styles.navLinks}>
          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link to="/shop" className={styles.actionBtn} aria-label="Search">
            <Search size={20} />
          </Link>
          <Link to="/login" className={styles.actionBtn} aria-label="Profile">
            <User size={20} />
          </Link>
          <Link to="/cart" className={`${styles.actionBtn} ${styles.cart}`}>
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </Link>
        </div>

        <button
          className={styles.mobileButton}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                isActive ? styles.mobileActive : styles.mobileLink
              }
              onClick={() => setMobileOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
          <div className={styles.mobileActions}>
            <Link
              to="/shop"
              className={styles.actionBtn}
              onClick={() => setMobileOpen(false)}
            >
              <Search size={20} />
            </Link>
            <Link
              to="/login"
              className={styles.actionBtn}
              onClick={() => setMobileOpen(false)}
              aria-label="Profile"
            >
              <User size={20} />
            </Link>
            <Link
              to="/cart"
              className={styles.actionBtn}
              onClick={() => setMobileOpen(false)}
            >
              <ShoppingBag size={20} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
