import { supabase } from "../../lib/supabase";

export interface AdminUser {
  id: string;
  email: string;
}

const isAdminUser = async (userId: string |undefined) => {
  console.log("Checking admin id:", userId);

  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  console.log("Returned Data:", data);
  console.log("Returned Error:", error);

  if (error) throw error;

  return !!data;
};
export const signInAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log("Logged in User ID:", data.user?.id);
  console.log("Logged in Email:", data.user?.email);

  if (error) throw error;

  const authorized = await isAdminUser(data.user?.id);
  console.log("Is Admin:", authorized);
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

  if (currentUser && (await isAdminUser(currentUser.id))) {
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
