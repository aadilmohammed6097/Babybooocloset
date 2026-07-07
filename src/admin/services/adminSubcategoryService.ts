import { supabase } from "../../lib/supabase";
import type { Subcategory, SubcategoryInput } from "../../types";

const mapSubcategory = (row: {
  id: string;
  category_id: string;
  title: string;
  slug: string;
}): Subcategory => ({
  id: row.id,
  category_id: row.category_id,
  title: row.title,
  slug: row.slug,
});

export async function getAdminSubcategories(): Promise<Subcategory[]> {
  const { data, error } = await supabase
    .from("subcategories")
    .select("id, category_id, title, slug")
    .order("title");

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapSubcategory);
}

export async function getAdminSubcategoriesByCategory(
  categoryId: string
): Promise<Subcategory[]> {
  const { data, error } = await supabase
    .from("subcategories")
    .select("id, category_id, title, slug")
    .eq("category_id", categoryId)
    .order("title");

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapSubcategory);
}

export async function createSubcategory(
  input: SubcategoryInput
): Promise<Subcategory> {
  const { data, error } = await supabase
    .from("subcategories")
    .insert(input)
    .select("id, category_id, title, slug")
    .single();

  if (error) throw new Error(error.message);
  return mapSubcategory(data);
}

export async function updateSubcategory(
  id: string,
  input: Partial<SubcategoryInput>
): Promise<Subcategory> {
  const { data, error } = await supabase
    .from("subcategories")
    .update(input)
    .eq("id", id)
    .select("id, category_id, title, slug")
    .single();

  if (error) throw new Error(error.message);
  return mapSubcategory(data);
}

export async function deleteSubcategory(id: string): Promise<void> {
  const { error } = await supabase.from("subcategories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
