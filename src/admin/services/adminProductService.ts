import { supabase } from "../../lib/supabase";
import type { AdminProduct, ProductInput, ProductImage } from "../../types";
import {
  deleteProductImagesByProductId,
  getPrimaryImageUrl,
  getProductImages,
  getProductImagesByProductIds,
} from "../../services/productImageService";

const SELECT =
  "id, name, description, price, sale_price, stock, image_url, is_featured, is_new, age_group, category_id, categories ( name )";

const mapAdminProduct = (
  row: Record<string, unknown>,
  images: ProductImage[] = []
): AdminProduct => {
  const categories = row.categories as { name: string } | { name: string }[] | null;
  const category = Array.isArray(categories) ? categories[0] : categories;
  const rawAgeGroup = (row.age_group as string) ?? "0-3m";
  const validAgeGroups = ["0-3m", "3-6m", "6-12m", "12-24m"] as const;
  const age_group = validAgeGroups.includes(rawAgeGroup as (typeof validAgeGroups)[number])
    ? (rawAgeGroup as (typeof validAgeGroups)[number])
    : "0-3m";
  const primaryImageUrl = getPrimaryImageUrl(images);

  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    price: Number(row.price),
    sale_price: row.sale_price != null ? Number(row.sale_price) : null,
    stock: Number(row.stock ?? 0),
    image_url: primaryImageUrl || ((row.image_url as string) ?? ""),
    images,
    featured: Boolean(row.is_featured),
    new_arrival: Boolean(row.is_new),
    age_group,
    category_id: (row.category_id as string) ?? null,
    category_name: category?.name,
  };
};

const attachImages = async (products: AdminProduct[]): Promise<AdminProduct[]> => {
  const imageMap = await getProductImagesByProductIds(products.map((product) => product.id));

  return products.map((product) => {
    const images = imageMap[product.id] ?? [];
    return {
      ...product,
      images,
      image_url: getPrimaryImageUrl(images) || product.image_url,
    };
  });
};

export async function getAdminProducts(): Promise<AdminProduct[]> {
  let { data, error } = await supabase.from("products").select(SELECT).order("name");

  if (error) {
    const fallback = await supabase.from("products").select("*").order("name");
    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    console.error(error.message);
    return [];
  }

  const products = (data ?? []).map((row) => mapAdminProduct(row as Record<string, unknown>));
  return attachImages(products);
}

export async function getAdminProductById(id: string): Promise<AdminProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    const fallback = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    if (fallback.error || !fallback.data) return null;
    const images = await getProductImages(id);
    return mapAdminProduct(fallback.data as Record<string, unknown>, images);
  }

  const images = await getProductImages(id);
  return mapAdminProduct(data as Record<string, unknown>, images);
}

export async function createProduct(input: ProductInput): Promise<AdminProduct> {
  const payload = {
    ...input,
    is_featured: input.featured,
    is_new: input.new_arrival,
  } as Record<string, unknown>;

  delete payload.featured;
  delete payload.new_arrival;

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapAdminProduct(data as Record<string, unknown>);
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<AdminProduct> {
  const payload: Record<string, unknown> = { ...input };
  if (typeof input.featured !== "undefined") payload.is_featured = input.featured;
  if (typeof input.new_arrival !== "undefined") payload.is_new = input.new_arrival;
  delete payload.featured;
  delete payload.new_arrival;

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  const images = await getProductImages(id);
  return mapAdminProduct(data as Record<string, unknown>, images);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteProductImagesByProductId(id);

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getDashboardStats() {
  const [products, featured, newArrivals] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_featured", true),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_new", true),
  ]);

  return {
    totalProducts: products.count ?? 0,
    featuredProducts: featured.count ?? 0,
    newArrivals: newArrivals.count ?? 0,
    pendingOrders: 0,
  };
}
