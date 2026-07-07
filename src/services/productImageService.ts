import { supabase } from "../lib/supabase";
import type { ProductImage, ProductImageInput } from "../types";
import {
  deleteProductImageFromStorage,
  uploadProductImage,
} from "./storageService";

export const MAX_PRODUCT_IMAGES = 6;

export function sortProductImages(images: ProductImage[]): ProductImage[] {
  return [...images].sort((a, b) => a.display_order - b.display_order);
}

export function getPrimaryImageUrl(images: ProductImage[]): string {
  const sorted = sortProductImages(images);
  const primary = sorted.find((image) => image.is_primary) ?? sorted[0];
  return primary?.image_url ?? "";
}

export function mapProductImageRow(row: Record<string, unknown>): ProductImage {
  return {
    id: row.id as string,
    product_id: row.product_id as string,
    image_url: row.image_url as string,
    display_order: Number(row.display_order),
    is_primary: Boolean(row.is_primary),
  };
}

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const { data, error } = await supabase
    .from("product_images")
    .select("id, product_id, image_url, display_order, is_primary")
    .eq("product_id", productId)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapProductImageRow(row as Record<string, unknown>));
}

export async function getProductImagesByProductIds(
  productIds: string[]
): Promise<Record<string, ProductImage[]>> {
  if (productIds.length === 0) {
    return {};
  }

  const { data, error } = await supabase
    .from("product_images")
    .select("id, product_id, image_url, display_order, is_primary")
    .in("product_id", productIds)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const grouped: Record<string, ProductImage[]> = {};

  for (const row of data ?? []) {
    const image = mapProductImageRow(row as Record<string, unknown>);
    if (!grouped[image.product_id]) {
      grouped[image.product_id] = [];
    }
    grouped[image.product_id].push(image);
  }

  return grouped;
}

export async function insertProductImages(
  productId: string,
  images: ProductImageInput[]
): Promise<ProductImage[]> {
  if (images.length === 0) {
    return [];
  }

  const payload = images.map((image) => ({
    product_id: productId,
    image_url: image.image_url,
    display_order: image.display_order,
    is_primary: image.is_primary,
  }));

  const { data, error } = await supabase
    .from("product_images")
    .insert(payload)
    .select("id, product_id, image_url, display_order, is_primary");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapProductImageRow(row as Record<string, unknown>));
}

export async function deleteProductImage(imageId: string): Promise<ProductImage | null> {
  const { data, error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId)
    .select("id, product_id, image_url, display_order, is_primary")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapProductImageRow(data as Record<string, unknown>) : null;
}

export async function deleteProductImagesByProductId(productId: string): Promise<void> {
  const images = await getProductImages(productId);
  await Promise.all(images.map((image) => deleteProductImageFromStorage(image.image_url)));

  const { error } = await supabase.from("product_images").delete().eq("product_id", productId);
  if (error) {
    throw new Error(error.message);
  }
}

export async function renormalizeProductImages(productId: string): Promise<ProductImage[]> {
  const images = await getProductImages(productId);
  const sorted = sortProductImages(images);

  const updatedImages: ProductImage[] = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const image = sorted[index];
    const { data, error } = await supabase
      .from("product_images")
      .update({ display_order: index, is_primary: index === 0 })
      .eq("id", image.id)
      .select("id, product_id, image_url, display_order, is_primary")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    updatedImages.push(mapProductImageRow(data as Record<string, unknown>));
  }

  return updatedImages;
}

async function uploadAndAttachProductImages(
  productId: string,
  files: File[],
  startOrder: number
): Promise<ProductImage[]> {
  const inputs: ProductImageInput[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const imageUrl = await uploadProductImage(productId, files[index], startOrder + index);
    inputs.push({
      image_url: imageUrl,
      display_order: startOrder + index,
      is_primary: startOrder === 0 && index === 0,
    });
  }

  return insertProductImages(productId, inputs);
}

export async function createProductImagesFromFiles(
  productId: string,
  files: File[]
): Promise<ProductImage[]> {
  if (files.length === 0) {
    throw new Error("Please upload at least one product image.");
  }

  if (files.length > MAX_PRODUCT_IMAGES) {
    throw new Error(`You can upload a maximum of ${MAX_PRODUCT_IMAGES} images.`);
  }

  await uploadAndAttachProductImages(productId, files, 0);
  return renormalizeProductImages(productId);
}

export async function syncProductImages(
  productId: string,
  existingImages: ProductImage[],
  newFiles: File[],
  deletedImageIds: string[]
): Promise<ProductImage[]> {
  const keptCount = existingImages.filter((image) => !deletedImageIds.includes(image.id)).length;
  const totalAfterSync = keptCount + newFiles.length;

  if (totalAfterSync === 0) {
    throw new Error("Please keep at least one product image.");
  }

  if (totalAfterSync > MAX_PRODUCT_IMAGES) {
    throw new Error(`You can have a maximum of ${MAX_PRODUCT_IMAGES} images per product.`);
  }

  for (const imageId of deletedImageIds) {
    const removed = await deleteProductImage(imageId);
    if (removed) {
      await deleteProductImageFromStorage(removed.image_url);
    }
  }

  if (newFiles.length > 0) {
    await uploadAndAttachProductImages(productId, newFiles, keptCount);
  }

  return renormalizeProductImages(productId);
}
