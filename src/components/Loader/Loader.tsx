import styles from "./Loader.module.css";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
}

const Loader = ({ size = "md" }: LoaderProps) => {
  return (
    <div className={styles.wrapper} role="status" aria-label="Loading">
      <div className={`${styles.spinner} ${styles[size]}`} />
    </div>
  );
};

export default Loader;
