import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/adminProductService";
import { createProductImagesFromFiles } from "../../../services/productImageService";
import type { ProductImageSubmitPayload, ProductInput } from "../../../types";
import ProductForm from "../../components/ProductForm/ProductForm";
import styles from "../../styles/AdminShared.module.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (data: ProductInput, imagePayload: ProductImageSubmitPayload) => {
    try {
      setUploading(true);
      const product = await createProduct(data);
      await createProductImagesFromFiles(product.id, imagePayload.newFiles);
      navigate("/admin/products");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Add Product</h1>
      <p className={styles.subtitle}>Create a new product for your store.</p>
      <div className={styles.card}>
        <ProductForm onSubmit={handleSubmit} submitLabel="Save Product" uploading={uploading} />
      </div>
    </div>
  );
};

export default AddProduct;
