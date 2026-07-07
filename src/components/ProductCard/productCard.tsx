import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "../../types";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button/Button";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const wishlisted = isWishlisted(product.id);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, product.sizes[0], 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    await toggleWishlist(product.id);
  };

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
          {product.isNew && <span className={styles.badge}>New</span>}
          <button
            className={`${styles.wishlist} ${wishlisted ? styles.wishlisted : ""}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </Link>

      <div className={styles.info}>
        <Link to={`/product/${product.id}`} className={styles.name}>
          {product.name}
        </Link>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={handleAddToCart}
          className={styles.addButton}
        >
          <ShoppingBag size={16} />
          {added ? "Added!" : "Add to Cart"}
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
