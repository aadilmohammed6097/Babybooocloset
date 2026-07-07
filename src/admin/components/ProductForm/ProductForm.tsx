import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import type { Category, ProductImage, ProductImageSubmitPayload, ProductInput } from "../../../types";
import { getAdminCategories } from "../../services/adminCategoryService";
import { MAX_PRODUCT_IMAGES } from "../../../services/productImageService";
import styles from "../../styles/AdminShared.module.css";
import imageStyles from "./ProductForm.module.css";

interface ProductFormProps {
  initial?: Partial<ProductInput>;
  initialImages?: ProductImage[];
  onSubmit: (data: ProductInput, imagePayload: ProductImageSubmitPayload) => Promise<void>;
  submitLabel: string;
  uploading?: boolean;
}

const ageGroups = ["0-3m", "3-6m", "6-12m", "12-24m"] as const;

const EMPTY_PRODUCT_IMAGES: ProductImage[] = [];

const defaultValues: ProductInput = {
  name: "",
  description: "",
  price: 0,
  sale_price: null,
  stock: 0,
  featured: false,
  new_arrival: false,
  age_group: "0-3m",
  category_id: "",
};

const ProductForm = ({
  initial,
  initialImages = EMPTY_PRODUCT_IMAGES,
  onSubmit,
  submitLabel,
  uploading,
}: ProductFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductInput>({ ...defaultValues, ...initial });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [existingImages, setExistingImages] = useState<ProductImage[]>(initialImages);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  useEffect(() => {
    getAdminCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!initial) return;
    setForm({ ...defaultValues, ...initial });
  }, [initial]);

  useEffect(() => {
    setExistingImages(initialImages);
    setDeletedImageIds([]);
    setNewFiles([]);
    setNewPreviews((prev) => {
      prev.forEach((preview) => URL.revokeObjectURL(preview));
      return [];
    });
  }, [initialImages]);

  useEffect(() => {
    return () => {
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [newPreviews]);

  const visibleExistingImages = useMemo(
    () => existingImages.filter((image) => !deletedImageIds.includes(image.id)),
    [existingImages, deletedImageIds]
  );

  const totalImageCount = visibleExistingImages.length + newFiles.length;
  const remainingSlots = MAX_PRODUCT_IMAGES - totalImageCount;

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

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) return;

    const allowedCount = Math.min(files.length, remainingSlots);
    if (allowedCount === 0) {
      setError(`You can upload a maximum of ${MAX_PRODUCT_IMAGES} images.`);
      return;
    }

    const nextFiles = files.slice(0, allowedCount);
    const nextPreviews = nextFiles.map((file) => URL.createObjectURL(file));

    setError("");
    setNewFiles((prev) => [...prev, ...nextFiles]);
    setNewPreviews((prev) => [...prev, ...nextPreviews]);
  };

  const removeExistingImage = (imageId: string) => {
    setDeletedImageIds((prev) => [...prev, imageId]);
    setError("");
  };

  const removeNewImage = (index: number) => {
    setNewFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
    setNewPreviews((prev) => {
      const next = [...prev];
      const [removedPreview] = next.splice(index, 1);
      if (removedPreview) {
        URL.revokeObjectURL(removedPreview);
      }
      return next;
    });
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (totalImageCount === 0) {
      setError("Please upload at least one product image.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(form, {
        newFiles,
        deletedImageIds,
      });
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

      <div className={`${styles.field} ${imageStyles.imageField}`}>
        <label className={styles.label} htmlFor="image_files">Product Images</label>
        <p className={imageStyles.imageHint}>
          Upload up to {MAX_PRODUCT_IMAGES} images. The first image is used as the primary image.
          {remainingSlots > 0 ? ` ${remainingSlots} slot${remainingSlots === 1 ? "" : "s"} remaining.` : ""}
        </p>
        <input
          id="image_files"
          name="image_files"
          type="file"
          accept="image/*"
          multiple
          disabled={remainingSlots === 0}
          onChange={handleImageSelection}
          className={`${styles.input} ${imageStyles.imageInput}`}
        />

        {totalImageCount > 0 && (
          <div className={imageStyles.imageGrid}>
            {visibleExistingImages.map((image, index) => (
              <div key={image.id} className={imageStyles.imagePreview}>
                <img src={image.image_url} alt={`Product image ${index + 1}`} />
                {index === 0 && <span className={imageStyles.primaryBadge}>Primary</span>}
                <button
                  type="button"
                  className={imageStyles.removeImageBtn}
                  onClick={() => removeExistingImage(image.id)}
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {newPreviews.map((preview, index) => (
              <div key={preview} className={imageStyles.imagePreview}>
                <img src={preview} alt={`New product image ${index + 1}`} />
                {visibleExistingImages.length === 0 && index === 0 && (
                  <span className={imageStyles.primaryBadge}>Primary</span>
                )}
                <button
                  type="button"
                  className={imageStyles.removeImageBtn}
                  onClick={() => removeNewImage(index)}
                  aria-label={`Remove new image ${index + 1}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
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
