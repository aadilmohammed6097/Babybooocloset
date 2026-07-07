import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export interface AuthUser {
  id: string;
  email: string;
}

const isAdminUser = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};

export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone = ""
): Promise<{ user: User; session: Session | null }> => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;
  if (!data.user) {
    throw new Error("Sign up failed. Please try again.");
  }

  const { error: profileError } = await supabase.from("customer_profiles").insert({
    id: data.user.id,
    first_name: firstName,
    last_name: lastName,
    phone,
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  return { user: data.user, session: data.session };
};

export const signIn = async (
  email: string,
  password: string
): Promise<{ user: User; session: Session | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) {
    throw new Error("Login failed. Please try again.");
  }

  if (await isAdminUser(data.user.id)) {
    await supabase.auth.signOut();
    throw new Error("Admin accounts must sign in from the admin login page.");
  }

  return { user: data.user, session: data.session };
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSession = async (): Promise<{
  user: AuthUser | null;
  session: Session | null;
}> => {
  const { data } = await supabase.auth.getSession();
  const currentUser = data.session?.user;

  if (!currentUser) {
    return { user: null, session: null };
  }

  if (await isAdminUser(currentUser.id)) {
    return { user: null, session: null };
  }

  return {
    user: { id: currentUser.id, email: currentUser.email ?? "" },
    session: data.session,
  };
};

export const onAuthChange = (
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) => supabase.auth.onAuthStateChange(callback);
