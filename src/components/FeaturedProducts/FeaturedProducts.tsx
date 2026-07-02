import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFeaturedProducts } from "../../services/productService";
import type { Product } from "../../types";
import ProductCard from "../ProductCard/productCard";
import styles from "./FeaturedProducts.module.css";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getFeaturedProducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Featured Products</h2>
          <Link to="/shop" className={styles.viewAll}>
            View All
          </Link>
        </div>
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
