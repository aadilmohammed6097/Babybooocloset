import { supabase } from "../lib/supabase";
import type { Product } from "../types";
import {
  getPrimaryImageUrl,
  getProductImagesByProductIds,
  sortProductImages,
} from "./productImageService";

interface ProductImageRow {
  id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
}

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
  product_images?: ProductImageRow[] | null;
}

const DEFAULT_SIZES = ["One Size"];

const SELECT =
  "id, name, description, price, sale_price, stock, image_url, is_featured, is_new, category_id, age_group, sizes, categories ( slug, name ), product_images ( id, image_url, display_order, is_primary )";

const SELECT_WITHOUT_IMAGES =
  "id, name, description, price, sale_price, stock, image_url, is_featured, is_new, category_id, age_group, sizes, categories ( slug, name )";

const getCategory = (row: ProductRow) => {
  if (!row.categories) return null;
  return Array.isArray(row.categories) ? row.categories[0] : row.categories;
};

const getImageUrls = (row: ProductRow, imageMap?: Record<string, ProductImageRow[]>): string[] => {
  const nestedImages = sortProductImages(
    (row.product_images ?? []).map((image) => ({
      id: image.id,
      product_id: row.id,
      image_url: image.image_url,
      display_order: image.display_order,
      is_primary: image.is_primary,
    }))
  );

  if (nestedImages.length > 0) {
    return nestedImages.map((image) => image.image_url);
  }

  const mappedImages = imageMap?.[row.id] ?? [];
  if (mappedImages.length > 0) {
    return mappedImages.map((image) => image.image_url);
  }

  return row.image_url ? [row.image_url] : [];
};

const mapProduct = (row: ProductRow, imageMap?: Record<string, ProductImageRow[]>): Product => {
  const category = getCategory(row);
  const imageUrls = getImageUrls(row, imageMap);
  const nestedImages = row.product_images ?? imageMap?.[row.id] ?? [];
  const primaryFromImages = getPrimaryImageUrl(
    nestedImages.map((image) => ({
      id: image.id,
      product_id: row.id,
      image_url: image.image_url,
      display_order: image.display_order,
      is_primary: image.is_primary,
    }))
  );
  const image = primaryFromImages || imageUrls[0] || row.image_url || "";

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    price: Number(row.sale_price ?? row.price),
    salePrice: row.sale_price,
    stock: row.stock,
    image,
    images: imageUrls.length > 0 ? imageUrls : image ? [image] : [],
    category: category?.slug ?? "unisex",
    categoryId: row.category_id ?? undefined,
    ageGroup: (row.age_group ?? "0-3m") as Product["ageGroup"],
    sizes: row.sizes?.length ? row.sizes : DEFAULT_SIZES,
    isFeatured: row.is_featured,
    isNew: row.is_new,
  };
};

const buildImageMap = async (rows: ProductRow[]): Promise<Record<string, ProductImageRow[]>> => {
  const productIds = rows.map((row) => row.id);
  const grouped = await getProductImagesByProductIds(productIds);

  return Object.fromEntries(
    Object.entries(grouped).map(([productId, images]) => [
      productId,
      images.map((image) => ({
        id: image.id,
        image_url: image.image_url,
        display_order: image.display_order,
        is_primary: image.is_primary,
      })),
    ])
  );
};

const queryAll = async (select = SELECT): Promise<ProductRow[]> => {
  const { data, error } = await supabase.from("products").select(select);

  if (error) {
    console.error("Failed to fetch products:", error.message);
    return [];
  }

  return (data ?? []) as unknown as ProductRow[];
};

const mapRows = async (rows: ProductRow[]): Promise<Product[]> => {
  const hasNestedImages = rows.some((row) => Array.isArray(row.product_images));
  const imageMap = hasNestedImages ? undefined : await buildImageMap(rows);
  return rows.map((row) => mapProduct(row, imageMap));
};

export async function getProducts(): Promise<Product[]> {
  let rows = await queryAll();
  if (rows.length === 0) {
    rows = await queryAll(SELECT_WITHOUT_IMAGES);
  }
  return mapRows(rows);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("is_featured", true);

  if (error) {
    const all = await getProducts();
    return all.filter((product) => product.isFeatured);
  }

  return mapRows((data ?? []) as unknown as ProductRow[]);
}

export async function getNewArrivals(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("is_new", true);

  if (error) {
    const all = await getProducts();
    return all.filter((product) => product.isNew);
  }

  return mapRows((data ?? []) as unknown as ProductRow[]);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    const fallback = await supabase.from("products").select(SELECT_WITHOUT_IMAGES).eq("id", id).maybeSingle();
    if (fallback.error || !fallback.data) return null;
    const [product] = await mapRows([fallback.data as unknown as ProductRow]);
    return product ?? null;
  }

  const [product] = await mapRows([data as unknown as ProductRow]);
  return product ?? null;
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.categoryId === product.categoryId || item.category === product.category)
    )
    .slice(0, limit);
}
