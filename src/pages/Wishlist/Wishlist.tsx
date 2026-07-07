import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { getProductsByIds } from "../../services/productService";
import type { Product } from "../../types";
import { formatPrice } from "../../utils/formatPrice";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import Footer from "../../components/footer/Footer";
import styles from "./Wishlist.module.css";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        setProducts(await getProductsByIds(wishlist));
      } finally {
        setLoading(false);
      }
    };

    if (!wishlistLoading) {
      void loadProducts();
    }
  }, [wishlist, wishlistLoading]);

  if (wishlistLoading || loading) return <Loader />;

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>My Wishlist</h1>

          {products.length === 0 ? (
            <div className={styles.empty}>
              <Heart size={48} strokeWidth={1.5} />
              <h2>Your wishlist is empty</h2>
              <p>Save items you love and come back to them later.</p>
              <Link to="/shop">
                <Button variant="primary" size="lg">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className={styles.list}>
              {products.map((product) => (
                <div key={product.id} className={styles.item}>
                  <Link to={`/product/${product.id}`} className={styles.itemImage}>
                    <img src={product.image} alt={product.name} />
                  </Link>

                  <div className={styles.itemInfo}>
                    <Link to={`/product/${product.id}`} className={styles.itemName}>
                      {product.name}
                    </Link>
                    <p className={styles.itemPrice}>{formatPrice(product.price)}</p>
                  </div>

                  <div className={styles.itemActions}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToCart(product, product.sizes[0], 1)}
                    >
                      <ShoppingBag size={16} />
                      Add to Cart
                    </Button>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => void removeFromWishlist(product.id)}
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
