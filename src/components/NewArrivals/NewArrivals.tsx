import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNewArrivals } from "../../services/productService";
import type { Product } from "../../types";
import ProductCard from "../ProductCard/productCard";
import styles from "./NewArrivals.module.css";

const NewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getNewArrivals().then(setProducts);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>New Arrivals</h2>
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

export default NewArrivals;
