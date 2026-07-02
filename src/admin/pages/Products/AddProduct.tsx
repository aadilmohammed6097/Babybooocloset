import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/adminProductService";
import type { ProductInput } from "../../../types";
import ProductForm from "../../components/ProductForm/ProductForm";
import styles from "../../styles/AdminShared.module.css";

const AddProduct = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: ProductInput) => {
    await createProduct(data);
    navigate("/admin/products");
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Add Product</h1>
      <p className={styles.subtitle}>Create a new product for your store.</p>
      <div className={styles.card}>
        <ProductForm onSubmit={handleSubmit} submitLabel="Save Product" />
      </div>
    </div>
  );
};

export default AddProduct;
