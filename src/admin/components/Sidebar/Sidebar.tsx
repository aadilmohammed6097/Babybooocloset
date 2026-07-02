import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Tags, ShoppingCart, Settings, LogOut } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import styles from "./Sidebar.module.css";

const links = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Categories", path: "/admin/categories", icon: Tags },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const Sidebar = () => {
  const { logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Babybooocloset Admin</div>

      <nav className={styles.nav}>
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            <Icon size={18} />
            {name}
          </NavLink>
        ))}
      </nav>

      <button className={styles.logout} onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
