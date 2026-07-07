import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getProfile,
  updateProfile,
  type CustomerProfile,
} from "../../services/customerProfileService";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import Footer from "../../components/footer/Footer";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getProfile(user.id);
        setForm({
          firstName: profile?.first_name ?? "",
          lastName: profile?.last_name ?? "",
          email: user.email,
          phone: profile?.phone ?? "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const updated: CustomerProfile = await updateProfile(user.id, {
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
      });

      setForm((prev) => ({
        ...prev,
        firstName: updated.first_name,
        lastName: updated.last_name,
        phone: updated.phone,
      }));
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>My Profile</h1>

          <form className={styles.card} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                readOnly
                className={`${styles.input} ${styles.readonly}`}
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
