import { supabase } from "../lib/supabase";

export async function uploadProductImage(file: File): Promise<string> {
  try {
    if (!file) {
      throw new Error("No file selected.");
    }

    console.log("Uploading file:", file);

    // Create a unique filename
    const extension = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${extension}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from("products")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });

    console.log("Upload Response:", data);
    console.log("Upload Error:", error);

    if (error) {
      throw new Error(
        `Upload failed: ${error.message}\n${JSON.stringify(error, null, 2)}`
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(filename);

    console.log("Public URL:", publicUrl);

    if (!publicUrl) {
      throw new Error("Failed to generate public URL.");
    }

    return publicUrl;
  } catch (err) {
    console.error("Storage Upload Error:", err);
    throw err;
  }
}

export default uploadProductImage;