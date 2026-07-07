import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Category, ProductInput } from "../../../types";
import { getAdminCategories } from "../../services/adminCategoryService";
import styles from "../../styles/AdminShared.module.css";

interface ProductFormProps {
  initial?: Partial<ProductInput>;
  onSubmit: (data: ProductInput, imageFile?: File | null) => Promise<void>;
  submitLabel: string;
  uploading?: boolean;
}

const ageGroups = ["0-3m", "3-6m", "6-12m", "12-24m"] as const;

const defaultValues: ProductInput = {
  name: "",
  description: "",
  price: 0,
  sale_price: null,
  stock: 0,
  image_url: "",
  featured: false,
  new_arrival: false,
  age_group: "0-3m",
  category_id: "",
};

const ProductForm = ({ initial, onSubmit, submitLabel, uploading }: ProductFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductInput>({ ...defaultValues, ...initial });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(form.image_url || "");

  useEffect(() => {
    getAdminCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (initial) setForm({ ...defaultValues, ...initial });
  }, [initial]);

  useEffect(() => {
    // keep preview in sync with initial value
    setPreviewUrl(form.image_url || "");
  }, [form.image_url]);

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
      await onSubmit(form, selectedFile ?? null);
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

        <div className={styles.field}>
          <label className={styles.label} htmlFor="age_group">Age Group</label>
          <select id="age_group" name="age_group" value={form.age_group} onChange={handleChange} required className={styles.select}>
            {ageGroups.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="image_file">Product Image</label>
        <input
          id="image_file"
          name="image_file"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = (e.target as HTMLInputElement).files?.[0] ?? null;
            if (file) {
              setSelectedFile(file);
              const url = URL.createObjectURL(file);
              setPreviewUrl(url);
              // keep form.image_url as preview for UI consistency
              setForm((prev) => ({ ...prev, image_url: url }));
            } else {
              setSelectedFile(null);
              setPreviewUrl("");
              setForm((prev) => ({ ...prev, image_url: "" }));
            }
          }}
          className={styles.input}
        />

        {previewUrl && (
          <div style={{ marginTop: 8 }}>
            <img src={previewUrl} alt="Preview" style={{ maxWidth: 200, borderRadius: 8 }} />
          </div>
        )}
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
        <button type="submit" className={styles.btnPrimary} disabled={saving || uploading}>
          {saving ? "Saving..." : uploading ? "Uploading..." : submitLabel}
        </button>
        <Link to="/admin/products" className={styles.btnOutline}>Cancel</Link>
      </div>
    </form>
  );
};

export default ProductForm;
