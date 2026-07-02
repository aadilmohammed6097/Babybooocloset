import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from "../../services/adminCategoryService";
import type { Category } from "../../../types";
import Loader from "../../../components/Loader/Loader";
import styles from "../../styles/AdminShared.module.css";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      setCategories(await getAdminCategories());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.title);
    setEditSlug(cat.slug);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditSlug("");
  };

  const saveEdit = async (id: string) => {
    try {
      const updated = await updateCategory(id, { name: editName, slug: editSlug });
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      cancelEdit();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products using it may be affected.`)) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createCategory({ name: newName, slug: newSlug });
      setCategories((prev) => [...prev, created]);
      setNewName("");
      setNewSlug("");
      setShowAdd(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create");
    }
  };

  const slugify = (value: string) =>
    value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  if (loading) return <Loader />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Categories</h1>
        <button className={styles.btnPrimary} onClick={() => setShowAdd(!showAdd)}>
          <Plus size={16} style={{ marginRight: 6 }} />
          Add Category
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {showAdd && (
        <div className={styles.card} style={{ marginBottom: 20 }}>
          <form onSubmit={handleAdd} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input
                  className={styles.input}
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
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
              <button type="submit" className={styles.btnPrimary}>Save Category</button>
              <button type="button" className={styles.btnOutline} onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.card}>
        {categories.length === 0 ? (
          <p className={styles.empty}>No categories yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      {editingId === cat.id ? (
                        <input className={styles.input} value={editName} onChange={(e) => setEditName(e.target.value)} />
                      ) : (
                        cat.title
                      )}
                    </td>
                    <td>
                      {editingId === cat.id ? (
                        <input className={styles.input} value={editSlug} onChange={(e) => setEditSlug(e.target.value)} />
                      ) : (
                        cat.slug
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        {editingId === cat.id ? (
                          <>
                            <button className={`${styles.btnPrimary} ${styles.btnSm}`} onClick={() => saveEdit(cat.id)}>
                              <Check size={14} />
                            </button>
                            <button className={`${styles.btnOutline} ${styles.btnSm}`} onClick={cancelEdit}>
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button className={`${styles.btnOutline} ${styles.btnSm}`} onClick={() => startEdit(cat)}>
                              <Pencil size={14} />
                            </button>
                            <button className={`${styles.btnDanger} ${styles.btnSm}`} onClick={() => handleDelete(cat.id, cat.title)}>
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

export default Categories;
