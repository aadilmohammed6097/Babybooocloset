import { supabase } from "../lib/supabase";
import type { Subcategory } from "../types";

interface SubcategoryRow {
  id: string;
  category_id: string;
  title: string;
  slug: string;
}

const mapSubcategory = (row: SubcategoryRow): Subcategory => ({
  id: row.id,
  category_id: row.category_id,
  title: row.title,
  slug: row.slug,
});

export async function getSubcategories(): Promise<Subcategory[]> {
  const { data, error } = await supabase
    .from("subcategories")
    .select("id, category_id, title, slug")
    .order("title");

  if (error) {
    console.error("Failed to fetch subcategories:", error.message);
    return [];
  }

  return (data as SubcategoryRow[]).map(mapSubcategory);
}

export async function getSubcategoriesByCategory(
  categoryId: string
): Promise<Subcategory[]> {
  const { data, error } = await supabase
    .from("subcategories")
    .select("id, category_id, title, slug")
    .eq("category_id", categoryId)
    .order("title");

  if (error) {
    console.error("Failed to fetch subcategories:", error.message);
    return [];
  }

  return (data as SubcategoryRow[]).map(mapSubcategory);
}
