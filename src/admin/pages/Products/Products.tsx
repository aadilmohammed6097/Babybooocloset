import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import {
  deleteProduct,
  getAdminProducts,
} from "../../services/adminProductService";
import type { AdminProduct } from "../../../types";
import Loader from "../../../components/Loader/Loader";
import styles from "../../styles/AdminShared.module.css";

const Products = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      setProducts(await getAdminProducts());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.search}
          />
          <Link to="/admin/products/add" className={styles.btnPrimary}>
            Add Product
          </Link>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.card}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>No products found.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Labels</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className={styles.thumb} />
                      ) : (
                        <div className={styles.thumb} />
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category_name ?? "—"}</td>
                    <td>
                      {product.sale_price != null ? (
                        <>
                          <s style={{ color: "#999", marginRight: 6 }}>{product.price}</s>
                          {product.sale_price}
                        </>
                      ) : (
                        product.price
                      )}
                    </td>
                    <td>{product.stock}</td>
                    <td>
                      {product.featured && <span className={styles.badge}>Featured</span>}{" "}
                      {product.new_arrival && <span className={styles.badge}>New</span>}
                      {!product.featured && !product.new_arrival && (
                        <span className={styles.badgeMuted}>—</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className={`${styles.btnOutline} ${styles.btnSm}`}
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          className={`${styles.btnDanger} ${styles.btnSm}`}
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
