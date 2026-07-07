import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Button from "../../components/Button/Button";
import styles from "./Login.module.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/" className={styles.logo}>
          Babybooocloset
        </Link>

        <h1 className={styles.title}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className={styles.subtitle}>
          {isLogin
            ? "Sign in to access your orders and wishlist."
            : "Join the Babybooocloset family today."}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <div className={styles.passwordWrap}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className={`${styles.input} ${styles.passwordInput}`}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {isLogin && (
            <Link to="#" className={styles.forgot}>
              Forgot Password?
            </Link>
          )}

          <Button type="submit" variant="primary" size="lg" fullWidth>
            {isLogin ? "Sign In" : "Register"}
          </Button>
        </form>

        {isLogin && (
          <p className={styles.adminOption}>
            <Link to="/admin/login">Login as admin</Link>
          </p>
        )}

        <p className={styles.switch}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
