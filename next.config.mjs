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
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "api.microlink.io",
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
