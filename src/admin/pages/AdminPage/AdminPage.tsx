import styles from "./AdminPage.module.css";

interface AdminPageProps {
  title: string;
  description?: string;
}

const AdminPage = ({ title, description }: AdminPageProps) => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.placeholder}>Coming soon</div>
    </div>
  );
};

export default AdminPage;
