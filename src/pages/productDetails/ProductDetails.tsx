import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Heart } from "lucide-react";
import {
  getProductById,
  getRelatedProducts,
} from "../../services/productService";
import type { Product } from "../../types";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "../../components/ProductCard/productCard";
import ProductImageGallery from "../../components/ProductImageGallery/ProductImageGallery";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import Footer from "../../components/footer/Footer";
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);

      const data = await getProductById(id);

      setProduct(data);

      if (data) {
        const relatedProducts = await getRelatedProducts(data);
        setRelated(relatedProducts);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Product not found</h2>
        <Link to="/shop">
          <Button variant="primary">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    const size = selectedSize || product.sizes[0];
    addToCart(product, size, quantity);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/product/${product.id}` } });
      return;
    }
    await toggleWishlist(product.id);
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <ProductImageGallery images={images} productName={product.name} />

          <div className={styles.info}>
            <h1 className={styles.name}>{product.name}</h1>

            {(product.categoryTitle || product.subcategoryTitle) && (
              <p className={styles.categoryMeta}>
                {[product.categoryTitle, product.subcategoryTitle].filter(Boolean).join(" / ")}
              </p>
            )}

            <p className={styles.price}>
              {formatPrice(product.price)}
            </p>

            <p className={styles.description}>
              {product.description}
            </p>

            <div className={styles.section}>
              <h3 className={styles.label}>Size</h3>

              <div className={styles.sizes}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${
                      (selectedSize || product.sizes[0]) === size
                        ? styles.activeSize
                        : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.label}>Quantity</h3>

              <div className={styles.quantity}>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                >
                  <Minus size={16} />
                </button>

                <span>{quantity}</span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className={styles.actions}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
              >
                {added ? "Added to Cart!" : "Add to Cart"}
              </Button>

              <button
                className={`${styles.wishlistBtn} ${
                  wishlisted ? styles.wishlisted : ""
                }`}
                onClick={() => void handleWishlist()}
              >
                <Heart
                  size={22}
                  fill={wishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className={styles.related}>
            <h2 className={styles.relatedTitle}>
              You May Also Like
            </h2>

            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ProductDetails;