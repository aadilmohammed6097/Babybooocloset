import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import type { AgeGroup, Category, Product } from "../../types";
import ProductCard from "../../components/ProductCard/productCard";
import Loader from "../../components/Loader/Loader";
import Footer from "../../components/footer/Footer";
import DropdownField from "../../components/FormFields/DropdownField";
import SearchField from "../../components/FormFields/SearchField";
import styles from "./Shop.module.css";

const ITEMS_PER_PAGE = 8;

const ageGroups: { label: string; value: AgeGroup }[] = [
  { label: "0–3 months", value: "0-3m" },
  { label: "3–6 months", value: "3-6m" },
  { label: "6–12 months", value: "6-12m" },
  { label: "12–24 months", value: "12-24m" },
];

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "low-high" },
  { label: "Price: High to Low", value: "high-low" },
] as const;

type SortOption = (typeof sortOptions)[number]["value"];

const matchesCategory = (product: Product, filter: string | null): boolean => {
  if (!filter) return true;
  return product.category === filter || product.categoryId === filter;
};

const isCategoryActive = (category: Category, filter: string | null): boolean => {
  if (!filter) return false;
  return category.slug === filter || category.id === filter;
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categoryFilter = searchParams.get("category");
  const ageFilter = searchParams.get("age") as AgeGroup | null;
  const sort = (searchParams.get("sort") as SortOption | null) ?? "default";

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        if (!cancelled) {
          setProducts(productData);
          setCategories(categoryData);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load products. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, ageFilter, sort]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesAge = !ageFilter || product.ageGroup === ageFilter;

      return (
        matchesSearch &&
        matchesCategory(product, categoryFilter) &&
        matchesAge
      );
    });

    if (sort === "low-high") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sort === "high-low") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, search, categoryFilter, ageFilter, sort]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleSortChange = (value: string) => {
    updateFilter("sort", value === "default" ? null : value);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Shop</h1>

          {error && <p className={styles.empty}>{error}</p>}

          <SearchField
            value={search}
            onChange={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            placeholder="Search products..."
            className={styles.searchBar}
          />

          <div className={styles.layout}>
            <aside className={styles.filters}>
              <div className={styles.filterGroup}>
                <h3 className={styles.filterTitle}>Category</h3>
                <button
                  type="button"
                  className={`${styles.filterOption} ${!categoryFilter ? styles.activeFilter : ""}`}
                  onClick={() => updateFilter("category", null)}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`${styles.filterOption} ${isCategoryActive(cat, categoryFilter) ? styles.activeFilter : ""}`}
                    onClick={() => updateFilter("category", cat.slug)}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>

              <div className={styles.filterGroup}>
                <h3 className={styles.filterTitle}>Age</h3>
                <button
                  type="button"
                  className={`${styles.filterOption} ${!ageFilter ? styles.activeFilter : ""}`}
                  onClick={() => updateFilter("age", null)}
                >
                  All Ages
                </button>
                {ageGroups.map((age) => (
                  <button
                    key={age.value}
                    type="button"
                    className={`${styles.filterOption} ${ageFilter === age.value ? styles.activeFilter : ""}`}
                    onClick={() => updateFilter("age", age.value)}
                  >
                    {age.label}
                  </button>
                ))}
              </div>

            </aside>

            <div className={styles.content}>
              <div className={styles.contentHeader}>
                <p className={styles.resultCount}>
                  {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""}
                </p>
                <DropdownField
                  label="Sort by"
                  labelPosition="inline"
                  value={sort}
                  options={[...sortOptions]}
                  onChange={handleSortChange}
                  minWidth={210}
                />
              </div>

              {paginatedProducts.length > 0 ? (
                <div className={styles.grid}>
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p className={styles.empty}>No products found.</p>
              )}

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={styles.pageBtn}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={styles.pageBtn}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
