import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import {
  createSubcategory,
  deleteSubcategory,
  getAdminSubcategories,
  updateSubcategory,
} from "../../services/adminSubcategoryService";
import { getAdminCategories } from "../../services/adminCategoryService";
import type { Category, Subcategory } from "../../../types";
import { slugify } from "../../../utils/slugify";
import Loader from "../../../components/Loader/Loader";
import styles from "../../styles/AdminShared.module.css";

const Subcategories = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [subcategoryData, categoryData] = await Promise.all([
        getAdminSubcategories(),
        getAdminCategories(),
      ]);
      setSubcategories(subcategoryData);
      setCategories(categoryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subcategories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getCategoryName = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.title ?? "—";

  const startEdit = (subcategory: Subcategory) => {
    setEditingId(subcategory.id);
    setEditCategoryId(subcategory.category_id);
    setEditTitle(subcategory.title);
    setEditSlug(subcategory.slug);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditCategoryId("");
    setEditTitle("");
    setEditSlug("");
  };

  const saveEdit = async (id: string) => {
    try {
      const updated = await updateSubcategory(id, {
        category_id: editCategoryId,
        title: editTitle,
        slug: editSlug,
      });
      setSubcategories((prev) => prev.map((item) => (item.id === id ? updated : item)));
      cancelEdit();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete subcategory "${title}"? Products using it may be affected.`)) return;
    try {
      await deleteSubcategory(id);
      setSubcategories((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const created = await createSubcategory({
        category_id: newCategoryId,
        title: newTitle,
        slug: newSlug,
      });
      setSubcategories((prev) => [...prev, created]);
      setNewCategoryId("");
      setNewTitle("");
      setNewSlug("");
      setShowAdd(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Subcategories</h1>
        <button className={styles.btnPrimary} onClick={() => setShowAdd(!showAdd)}>
          <Plus size={16} style={{ marginRight: 6 }} />
          Add Subcategory
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {showAdd && (
        <div className={styles.card} style={{ marginBottom: 20 }}>
          <form onSubmit={handleAdd} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <select
                  className={styles.select}
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Subcategory Name</label>
                <input
                  className={styles.input}
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) setNewSlug(slugify(e.target.value));
                  }}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Slug</label>
                <input
                  className={styles.input}
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.btnPrimary}>Save Subcategory</button>
              <button type="button" className={styles.btnOutline} onClick={() => setShowAdd(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.card}>
        {subcategories.length === 0 ? (
          <p className={styles.empty}>No subcategories yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((subcategory) => (
                  <tr key={subcategory.id}>
                    <td>
                      {editingId === subcategory.id ? (
                        <select
                          className={styles.select}
                          value={editCategoryId}
                          onChange={(e) => setEditCategoryId(e.target.value)}
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.title}
                            </option>
                          ))}
                        </select>
                      ) : (
                        getCategoryName(subcategory.category_id)
                      )}
                    </td>
                    <td>
                      {editingId === subcategory.id ? (
                        <input
                          className={styles.input}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      ) : (
                        subcategory.title
                      )}
                    </td>
                    <td>
                      {editingId === subcategory.id ? (
                        <input
                          className={styles.input}
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                        />
                      ) : (
                        subcategory.slug
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        {editingId === subcategory.id ? (
                          <>
                            <button
                              className={`${styles.btnPrimary} ${styles.btnSm}`}
                              onClick={() => saveEdit(subcategory.id)}
                            >
                              <Check size={14} />
                            </button>
                            <button className={`${styles.btnOutline} ${styles.btnSm}`} onClick={cancelEdit}>
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={`${styles.btnOutline} ${styles.btnSm}`}
                              onClick={() => startEdit(subcategory)}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              className={`${styles.btnDanger} ${styles.btnSm}`}
                              onClick={() => handleDelete(subcategory.id, subcategory.title)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
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

export default Subcategories;
