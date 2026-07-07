import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getAdminSession,
  onAdminAuthChange,
  signInAdmin,
  signOutAdmin,
  type AdminUser,
} from "../services/authService";

interface AdminAuthContextType {
  user: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = !!user;

  useEffect(() => {
    const initialize = async () => {
      try {
        const { user: currentUser } = await getAdminSession();
        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    };

    void initialize();

    const { data: listener } = onAdminAuthChange(async () => {
      const { user: currentUser } = await getAdminSession();
      setUser(currentUser);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { user: nextUser } = await signInAdmin(email, password);
    if (!nextUser) {
      throw new Error("Login failed. Please try again.");
    }
    setUser(nextUser);
  };

  const logout = async () => {
    await signOutAdmin();
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ user, loading, isAdmin, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};
