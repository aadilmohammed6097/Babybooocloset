import { supabase } from "../lib/supabase";

export interface CustomerProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface CustomerProfileInput {
  first_name: string;
  last_name: string;
  phone: string;
}

export const getProfile = async (userId: string): Promise<CustomerProfile | null> => {
  const { data, error } = await supabase
    .from("customer_profiles")
    .select("id, first_name, last_name, phone")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as CustomerProfile | null;
};

export const updateProfile = async (
  userId: string,
  input: CustomerProfileInput
): Promise<CustomerProfile> => {
  const { data, error } = await supabase
    .from("customer_profiles")
    .update({
      first_name: input.first_name,
      last_name: input.last_name,
      phone: input.phone,
    })
    .eq("id", userId)
    .select("id, first_name, last_name, phone")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to update profile.");
  }

  return data as CustomerProfile;
};
