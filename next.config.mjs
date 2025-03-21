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
        hostname: "api.takeout-threads.com",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "aftkzcdfjeidbfutfhfw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "api.microlink.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "takeout-threads.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "*.takeout-threads.com",
        port: "",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  }
};

export default nextConfig;
