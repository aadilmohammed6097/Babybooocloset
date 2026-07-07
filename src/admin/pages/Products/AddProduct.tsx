import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/adminProductService";
import { uploadProductImage } from "../../../services/storageService";
import type { ProductInput } from "../../../types";
import ProductForm from "../../components/ProductForm/ProductForm";
import styles from "../../styles/AdminShared.module.css";

const AddProduct = () => {
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);

  const handleSubmitWithUpload = async (data: ProductInput, imageFile?: File | null) => {
    try {
      if (imageFile) {
        setUploading(true);
        const publicUrl = await uploadProductImage(imageFile);
        data.image_url = publicUrl;
      }

      await createProduct(data);
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
        <ProductForm onSubmit={handleSubmitWithUpload} submitLabel="Save Product" uploading={uploading} />
      </div>
    </div>
  );
};

export default AddProduct;
