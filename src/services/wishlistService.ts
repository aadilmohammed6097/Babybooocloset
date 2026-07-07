import { supabase } from "../lib/supabase";

export interface WishlistRow {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export const getWishlist = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => row.product_id as string);
};

export const add = async (userId: string, productId: string): Promise<void> => {
  const { error } = await supabase.from("wishlists").insert({
    user_id: userId,
    product_id: productId,
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const remove = async (userId: string, productId: string): Promise<void> => {
  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) {
    throw new Error(error.message);
  }
};

export const isWishlisted = async (
  userId: string,
  productId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return !!data;
};

export const toggle = async (
  userId: string,
  productId: string
): Promise<boolean> => {
  const wishlisted = await isWishlisted(userId, productId);

  if (wishlisted) {
    await remove(userId, productId);
    return false;
  }

  await add(userId, productId);
  return true;
};
