import { STATE_OPTIONS } from "../constants/locationOptions";

export interface PincodeLookupResult {
  city: string;
  state: string;
  country: string;
}

type PostalApiResponse = Array<{
  Status: string;
  Message: string;
  PostOffice?: Array<{
    Name: string;
    District: string;
    State: string;
    Country: string;
  }> | null;
}>;

const normalize = (value: string) => value.trim().toLowerCase();

const matchStateOption = (apiState: string): string => {
  const exact = STATE_OPTIONS.find(
    (option) => normalize(option.value) === normalize(apiState)
  );
  if (exact?.value) return exact.value;

  const partial = STATE_OPTIONS.find(
    (option) =>
      option.value &&
      (normalize(option.value).includes(normalize(apiState)) ||
        normalize(apiState).includes(normalize(option.value)))
  );

  return partial?.value || apiState;
};

export async function lookupIndianPincode(
  pincode: string
): Promise<PincodeLookupResult | null> {
  const cleaned = pincode.trim();
  if (!/^\d{6}$/.test(cleaned)) {
    return null;
  }

  const response = await fetch(
    `https://api.postalpincode.in/pincode/${cleaned}`
  );

  if (!response.ok) {
    throw new Error("Unable to look up pin code.");
  }

  const data = (await response.json()) as PostalApiResponse;
  const result = data[0];
  const postOffice = result?.PostOffice?.[0];

  if (result?.Status !== "Success" || !postOffice) {
    return null;
  }

  return {
    city: postOffice.District || postOffice.Name || "",
    state: matchStateOption(postOffice.State || ""),
    country: postOffice.Country || "India",
  };
}
