import { supabase } from "../lib/supabase";

const PRODUCTS_BUCKET = "products";

export function getProductImageStoragePath(productId: string, index: number): string {
  return `${productId}/${index}.jpg`;
}

export function getStoragePathFromPublicUrl(publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${PRODUCTS_BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(publicUrl.slice(index + marker.length));
}

export async function uploadProductImage(
  productId: string,
  file: File,
  index: number
): Promise<string> {
  if (!file) {
    throw new Error("No file selected.");
  }

  const path = getProductImageStoragePath(productId, index);

  const { error } = await supabase.storage.from(PRODUCTS_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || "image/jpeg",
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PRODUCTS_BUCKET).getPublicUrl(path);

  if (!publicUrl) {
    throw new Error("Failed to generate public URL.");
  }

  return publicUrl;
}

export async function deleteProductImageFromStorage(publicUrl: string): Promise<void> {
  const path = getStoragePathFromPublicUrl(publicUrl);
  if (!path) return;

  const { error } = await supabase.storage.from(PRODUCTS_BUCKET).remove([path]);
  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

export async function deleteProductImagesFromStorage(publicUrls: string[]): Promise<void> {
  const paths = publicUrls
    .map(getStoragePathFromPublicUrl)
    .filter((path): path is string => Boolean(path));

  if (paths.length === 0) return;

  const { error } = await supabase.storage.from(PRODUCTS_BUCKET).remove(paths);
  if (error) {
    throw new Error(`Failed to delete images: ${error.message}`);
  }
}
