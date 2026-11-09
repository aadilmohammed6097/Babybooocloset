import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./DropdownField.module.css";

export type DropdownOption = {
  label: string;
  value: string;
};

type DropdownFieldProps = {
  id?: string;
  label?: string;
  labelPosition?: "above" | "inline";
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  className?: string;
  minWidth?: number | string;
  searchable?: boolean;
  searchPlaceholder?: string;
};

const DropdownField = ({
  id,
  label,
  labelPosition = "above",
  value,
  options,
  onChange,
  className = "",
  minWidth,
  searchable = false,
  searchPlaceholder = "Search...",
}: DropdownFieldProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const selectedLabel =
    options.find((option) => option.value === value)?.label ??
    options[0]?.label ??
    "";

  const filteredOptions = useMemo(() => {
    if (!searchable || !search.trim()) return options;
    const query = search.trim().toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [options, search, searchable]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      return;
    }

    if (searchable) {
      window.setTimeout(() => searchInputRef.current?.focus(), 0);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, searchable]);

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  const field = (
    <div
      className={styles.dropdown}
      ref={dropdownRef}
      style={minWidth ? { minWidth } : undefined}
    >
      <button
        id={id}
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label ? `${label}: ${selectedLabel}` : selectedLabel}
      >
        <span className={styles.triggerLabel}>{selectedLabel}</span>
        <ChevronDown
          size={16}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
      </button>
      {open && (
        <div className={styles.menu} role="listbox">
          {searchable && (
            <div className={styles.searchWrap}>
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
                className={styles.searchInput}
                aria-label={searchPlaceholder}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              />
            </div>
          )}
          <div className={styles.optionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value || option.label}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  className={`${styles.option} ${value === option.value ? styles.optionActive : ""}`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <p className={styles.noResults}>No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (!label) {
    return <div className={className}>{field}</div>;
  }

  if (labelPosition === "inline") {
    return (
      <div className={`${styles.inlineControl} ${className}`}>
        <span className={styles.inlineLabel}>{label}</span>
        {field}
      </div>
    );
  }

  return (
    <div className={`${styles.control} ${className}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {field}
    </div>
  );
};

export default DropdownField;
