import { supabase } from "../lib/supabase";
import type { Product } from "../types";

interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  stock: number;
  image_url: string | null;
  is_featured: boolean;
  is_new: boolean;
  category_id: string | null;
  age_group?: string | null;
  sizes?: string[] | null;
  categories?: { slug: string; name: string } | { slug: string; name: string }[] | null;
}

const DEFAULT_SIZES = ["One Size"];

const SELECT =
  "id, name, description, price, sale_price, stock, image_url, is_featured, is_new, category_id, age_group, sizes, categories ( slug, name )";

const getCategory = (row: ProductRow) => {
  if (!row.categories) return null;
  return Array.isArray(row.categories) ? row.categories[0] : row.categories;
};

const mapProduct = (row: ProductRow): Product => {
  const category = getCategory(row);
  const image = row.image_url ?? "";

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    price: Number(row.sale_price ?? row.price),
    salePrice: row.sale_price,
    stock: row.stock,
    image,
    images: image ? [image] : [],
    category: category?.slug ?? "unisex",
    categoryId: row.category_id ?? undefined,
    ageGroup: (row.age_group ?? "0-3m") as Product["ageGroup"],
    sizes: row.sizes?.length ? row.sizes : DEFAULT_SIZES,
    isFeatured: row.is_featured,
    isNew: row.is_new,
  };
};

const queryAll = async (select = SELECT): Promise<ProductRow[]> => {
  const { data, error } = await supabase.from("products").select(select);

  if (error) {
    console.error("Failed to fetch products:", error.message);
    return [];
  }

  return (data ?? []) as unknown as ProductRow[];
};

export async function getProducts(): Promise<Product[]> {
  let rows = await queryAll();
  if (rows.length === 0) rows = await queryAll("*");
  return rows.map(mapProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("is_featured", true);

  if (error) {
    const all = await getProducts();
    return all.filter((p) => p.isFeatured);
  }

  return ((data ?? []) as unknown as ProductRow[]).map(mapProduct);
}

export async function getNewArrivals(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("is_new", true);

  if (error) {
    const all = await getProducts();
    return all.filter((p) => p.isNew);
  }

  return ((data ?? []) as unknown as ProductRow[]).map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    const fallback = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    if (fallback.error || !fallback.data) return null;
    return mapProduct(fallback.data as unknown as ProductRow);
  }

  return mapProduct(data as unknown as ProductRow);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categoryId === product.categoryId || p.category === product.category)
    )
    .slice(0, limit);
}
