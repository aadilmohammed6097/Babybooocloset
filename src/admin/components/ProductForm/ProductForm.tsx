import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Category, ProductInput } from "../../../types";
import { getAdminCategories } from "../../services/adminCategoryService";
import styles from "../../styles/AdminShared.module.css";

interface ProductFormProps {
  initial?: Partial<ProductInput>;
  onSubmit: (data: ProductInput) => Promise<void>;
  submitLabel: string;
}

const defaultValues: ProductInput = {
  name: "",
  description: "",
  price: 0,
  sale_price: null,
  stock: 0,
  image_url: "",
  featured: false,
  new_arrival: false,
  category_id: "",
};

const ProductForm = ({ initial, onSubmit, submitLabel }: ProductFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductInput>({ ...defaultValues, ...initial });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (initial) setForm({ ...defaultValues, ...initial });
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price" || name === "stock"
            ? Number(value)
            : name === "sale_price"
              ? value === "" ? null : Number(value)
              : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">Product Name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} required className={styles.input} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="description">Description</label>
        <textarea id="description" name="description" value={form.description} onChange={handleChange} className={styles.textarea} />
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="price">Price</label>
          <input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sale_price">Sale Price</label>
          <input id="sale_price" name="sale_price" type="number" min="0" step="0.01" value={form.sale_price ?? ""} onChange={handleChange} className={styles.input} placeholder="Optional" />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="stock">Stock</label>
          <input id="stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="category_id">Category</label>
          <select id="category_id" name="category_id" value={form.category_id} onChange={handleChange} required className={styles.select}>
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="image_url">Image URL</label>
        <input id="image_url" name="image_url" value={form.image_url} onChange={handleChange} className={styles.input} placeholder="https://..." />
      </div>

      <label className={styles.checkboxRow}>
        <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
        Featured product
      </label>

      <label className={styles.checkboxRow}>
        <input type="checkbox" name="new_arrival" checked={form.new_arrival} onChange={handleChange} />
        New arrival
      </label>

      <div className={styles.formActions}>
        <button type="submit" className={styles.btnPrimary} disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
        <Link to="/admin/products" className={styles.btnOutline}>Cancel</Link>
      </div>
    </form>
  );
};

export default ProductForm;
