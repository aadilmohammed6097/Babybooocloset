import { supabase } from "../lib/supabase";
import type { Category } from "../types";
import { categories as fallbackCategories } from "./mockData";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .order("name");

  if (error) {
    console.error("Failed to fetch categories:", error.message);
    return fallbackCategories;
  }

  return (data as CategoryRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.name,
    image:
      row.image_url ??
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=800&fit=crop",
  }));
}
