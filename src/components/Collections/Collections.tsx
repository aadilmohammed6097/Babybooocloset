import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import type { Category } from "../../types";
import styles from "./Collections.module.css";

const Collections = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Shop by Collection</h2>
        <div className={styles.grid}>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={category.image}
                  alt={category.title}
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.overlay} />
              </div>
              <h3 className={styles.cardTitle}>{category.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
