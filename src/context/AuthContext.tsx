import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import {
  getSession,
  onAuthChange,
  signIn,
  signOut,
  signUp,
  type AuthUser,
} from "../services/authService";

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const syncSession = useCallback(async () => {
    const { user: currentUser, session: currentSession } = await getSession();
    setUser(currentUser);
    setSession(currentSession);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        await syncSession();
      } finally {
        setLoading(false);
      }
    };

    void initialize();

    const { data: listener } = onAuthChange(() => syncSession());

    return () => listener.subscription.unsubscribe();
  }, [syncSession]);

  const login = async (email: string, password: string) => {
    const { user: nextUser, session: nextSession } = await signIn(email, password);
    setUser({ id: nextUser.id, email: nextUser.email ?? email });
    setSession(nextSession);
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone = ""
  ) => {
    const { user: nextUser, session: nextSession } = await signUp(
      email,
      password,
      firstName,
      lastName,
      phone
    );
    setUser({ id: nextUser.id, email: nextUser.email ?? email });
    setSession(nextSession);
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
