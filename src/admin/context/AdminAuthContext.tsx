import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getAdminSession,
  isAllowedAdmin,
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

  const isAdmin = isAllowedAdmin(user?.email);

  useEffect(() => {
    getAdminSession().then(({ user: currentUser }) => {
      setUser(currentUser);
      setLoading(false);
    });

    const { data: listener } = onAdminAuthChange(async (_event, nextSession) => {
      const nextUser = nextSession?.user ?? null;
      if (nextUser && !isAllowedAdmin(nextUser.email)) {
        await signOutAdmin();
        setUser(null);
        return;
      }
      if (nextUser) {
        setUser({ id: nextUser.id, email: nextUser.email ?? "" });
      }
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
