import { supabase } from "../../lib/supabase";

const DEV_SESSION_KEY = "Babybooocloset_dev_admin";

export interface AdminUser {
  id: string;
  email: string;
}

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;
const adminPass = import.meta.env.VITE_ADMIN_PASS as string | undefined;

export const isDevAuthEnabled = (): boolean =>
  import.meta.env.DEV && !!adminEmail && !!adminPass;

export const isAllowedAdmin = (email: string | undefined): boolean => {
  if (!email) return false;
  if (!adminEmail) return true;
  return email.toLowerCase() === adminEmail.toLowerCase();
};

export const getDevAdmin = (): AdminUser | null => {
  if (!isDevAuthEnabled()) return null;

  const raw = sessionStorage.getItem(DEV_SESSION_KEY);
  if (!raw) return null;

  try {
    const user = JSON.parse(raw) as AdminUser;
    return isAllowedAdmin(user.email) ? user : null;
  } catch {
    return null;
  }
};

const setDevAdmin = (user: AdminUser) => {
  sessionStorage.setItem(DEV_SESSION_KEY, JSON.stringify(user));
};

export const clearDevAdmin = () => {
  sessionStorage.removeItem(DEV_SESSION_KEY);
};

const tryDevSignIn = (
  email: string,
  password: string
): AdminUser | null => {
  if (!isDevAuthEnabled()) return null;

  if (
    email.toLowerCase() === adminEmail!.toLowerCase() &&
    password === adminPass
  ) {
    const user: AdminUser = { id: "dev-admin", email: adminEmail! };
    setDevAdmin(user);
    return user;
  }

  return null;
};

export const signInAdmin = async (email: string, password: string) => {
  const devUser = tryDevSignIn(email, password);
  if (devUser) {
    return { session: null, user: devUser };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  if (!isAllowedAdmin(data.user?.email)) {
    await supabase.auth.signOut();
    throw new Error("You do not have permission to access the admin panel.");
  }

  return {
    session: data.session,
    user: data.user
      ? { id: data.user.id, email: data.user.email ?? email }
      : null,
  };
};

export const signOutAdmin = async () => {
  clearDevAdmin();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getAdminSession = async (): Promise<{
  user: AdminUser | null;
  session: unknown;
}> => {
  const devUser = getDevAdmin();
  if (devUser) {
    return { user: devUser, session: null };
  }

  const { data } = await supabase.auth.getSession();
  const currentUser = data.session?.user;

  if (currentUser && isAllowedAdmin(currentUser.email)) {
    return {
      user: { id: currentUser.id, email: currentUser.email ?? "" },
      session: data.session,
    };
  }

  return { user: null, session: null };
};

export const onAdminAuthChange = (
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) => supabase.auth.onAuthStateChange(callback);
