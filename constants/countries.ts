export const countries = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "MX", label: "Mexico" },
    { value: "GB", label: "United Kingdom" },
    // Add more as needed, but these are the most common for US-based businesses
  ] as const
  
  export type CountryCode = typeof countries[number]["value"]