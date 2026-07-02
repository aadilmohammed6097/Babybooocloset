import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, Heart } from "lucide-react";
import {
  getProductById,
  getRelatedProducts,
} from "../../services/productService";
import type { Product } from "../../types";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/ProductCard/productCard";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import Footer from "../../components/footer/Footer";
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);

      const data = await getProductById(id);

      console.log("Product:", data);
      console.log("Image:", data?.image);
      console.log("Images:", data?.images);

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

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              <img src={images[activeImage]} alt={product.name} />
            </div>

            {images.length > 1 && (
              <div className={styles.thumbnails}>
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnail} ${
                      activeImage === index ? styles.activeThumb : ""
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.info}>
            <h1 className={styles.name}>{product.name}</h1>

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
                onClick={() => toggleWishlist(product.id)}
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