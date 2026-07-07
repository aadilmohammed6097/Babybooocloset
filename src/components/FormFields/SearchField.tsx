import { Search } from "lucide-react";
import styles from "./SearchField.module.css";

type SearchFieldProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const SearchField = ({
  id,
  label,
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchFieldProps) => {
  return (
    <div className={`${styles.control} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.wrapper}>
        <Search size={18} className={styles.icon} />
        <input
          id={id}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default SearchField;
