import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdminAuthProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CartProvider>
    </AdminAuthProvider>
  </StrictMode>
);
