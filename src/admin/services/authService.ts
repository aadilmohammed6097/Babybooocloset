import { supabase } from "../../lib/supabase";

export interface AdminUser {
  id: string;
  email: string;
}

const isAdminUser = async (email: string | undefined): Promise<boolean> => {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to verify admin access.");
  }

  return !!data;
};

export const signInAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const authorized = await isAdminUser(data.user?.email);
  if (!authorized) {
    await supabase.auth.signOut();
    throw new Error("Unauthorized");
  }

  return {
    session: data.session,
    user: data.user
      ? { id: data.user.id, email: data.user.email ?? email }
      : null,
  };
};

export const signOutAdmin = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getAdminSession = async (): Promise<{
  user: AdminUser | null;
  session: unknown;
}> => {
  const { data } = await supabase.auth.getSession();
  const currentUser = data.session?.user;

  if (currentUser && (await isAdminUser(currentUser.email))) {
    return {
      user: { id: currentUser.id, email: currentUser.email ?? "" },
      session: data.session,
    };
  }

  if (currentUser) {
    await supabase.auth.signOut();
  }

  return { user: null, session: null };
};

export const onAdminAuthChange = (
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) => supabase.auth.onAuthStateChange(callback);
