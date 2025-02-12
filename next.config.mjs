/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "gravatar.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "takeoutthreads.kinde.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "aftkzcdfjeidbfutfhfw.supabase.co",
        port: "",
      },
    ],
  },
};

export default nextConfig;
