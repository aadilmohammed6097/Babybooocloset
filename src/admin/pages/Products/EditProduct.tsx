import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdminProductById,
  updateProduct,
} from "../../services/adminProductService";
import { syncProductImages } from "../../../services/productImageService";
import type { ProductImage, ProductImageSubmitPayload, ProductInput } from "../../../types";
import ProductForm from "../../components/ProductForm/ProductForm";
import Loader from "../../../components/Loader/Loader";
import styles from "../../styles/AdminShared.module.css";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<Partial<ProductInput>>();
  const [initialImages, setInitialImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;

    getAdminProductById(id).then((product) => {
      if (product) {
        setInitial({
          name: product.name,
          description: product.description,
          price: product.price,
          sale_price: product.sale_price,
          stock: product.stock,
          featured: product.featured,
          new_arrival: product.new_arrival,
          age_group: product.age_group,
          category_id: product.category_id ?? "",
        });
        setInitialImages(product.images);
      }
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (
    data: ProductInput,
    imagePayload: ProductImageSubmitPayload
  ) => {
    if (!id) return;

    try {
      setUploading(true);
      await updateProduct(id, data);
      await syncProductImages(id, initialImages, imagePayload.newFiles, imagePayload.deletedImageIds);
      navigate("/admin/products");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader />;

  if (!initial) {
    return (
      <div className={styles.page}>
        <p className={styles.empty}>Product not found.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Edit Product</h1>
      <p className={styles.subtitle}>Update product details, price, and labels.</p>
      <div className={styles.card}>
        <ProductForm
          initial={initial}
          initialImages={initialImages}
          onSubmit={handleSubmit}
          submitLabel="Update Product"
          uploading={uploading}
        />
      </div>
    </div>
  );
};

export default EditProduct;
