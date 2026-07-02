import { supabase } from "../../lib/supabase";
import type { Category, CategoryInput } from "../../types";

export async function getAdminCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .order("name");

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.name,
    image: row.image_url ?? "",
  }));
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: input.name,
      slug: input.slug,
      image_url: input.image_url ?? null,
    })
    .select("id, name, slug, image_url")
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    slug: data.slug,
    title: data.name,
    image: data.image_url ?? "",
  };
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>
): Promise<Category> {
  const payload: Record<string, string | null> = {};
  if (input.name !== undefined) payload.name = input.name;
  if (input.slug !== undefined) payload.slug = input.slug;
  if (input.image_url !== undefined) payload.image_url = input.image_url || null;

  const { data, error } = await supabase
    .from("categories")
    .update(payload)
    .eq("id", id)
    .select("id, name, slug, image_url")
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    slug: data.slug,
    title: data.name,
    image: data.image_url ?? "",
  };
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
