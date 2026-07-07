import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, ShoppingBag, Heart, LogOut } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();

  const links = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
  ];

  const authLinks = user
    ? [
        { name: "Wishlist", path: "/wishlist" },
        { name: "My Orders", path: "/orders" },
      ]
    : [
        { name: "Login", path: "/login" },
        { name: "Register", path: "/register" },
      ];

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    setMobileOpen(false);
    navigate("/");
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

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
          {authLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
          {user && (
            <Link to="/wishlist" className={`${styles.actionBtn} ${styles.cart}`} aria-label="Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className={styles.badge}>{wishlist.length}</span>
              )}
            </Link>
          )}
          <Link
            to={user ? "/profile" : "/login"}
            className={styles.actionBtn}
            aria-label={user ? "Profile" : "Login"}
          >
            <User size={20} />
          </Link>
          <Link to="/cart" className={`${styles.actionBtn} ${styles.cart}`} aria-label="Cart">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </Link>
          {user && (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={openLogoutModal}
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>

        <div className={styles.mobileHeaderActions}>
          {user && (
            <Link
              to="/wishlist"
              className={`${styles.actionBtn} ${styles.cart} ${styles.mobileCart}`}
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className={styles.badge}>{wishlist.length}</span>
              )}
            </Link>
          )}
          <Link
            to="/cart"
            className={`${styles.actionBtn} ${styles.cart} ${styles.mobileCart}`}
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </Link>

          <button
            className={styles.mobileButton}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
              onClick={closeMobile}
            >
              {item.name}
            </NavLink>
          ))}
          {authLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? styles.mobileActive : styles.mobileLink
              }
              onClick={closeMobile}
            >
              {item.name}
            </NavLink>
          ))}
          {user && (
            <button
              type="button"
              className={styles.mobileLogout}
              onClick={openLogoutModal}
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      )}

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Log Out"
      >
        <p className={styles.logoutMessage}>
          Are you sure you want to log out of your account?
        </p>
        <div className={styles.logoutActions}>
          <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => void handleLogout()}>
            Log Out
          </Button>
        </div>
      </Modal>
    </header>
  );
};

export default Navbar;
