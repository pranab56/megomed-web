/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http", // ← changed from https to http
        hostname: "10.10.7.65", // ← internal IP
        port: "5006", // ← must match the port in the URL
        pathname: "/**",
      },
      {
        protocol: "http", // ← changed from https to http
        hostname: "92.205.234.176", // ← internal IP
        port: "5002", // ← must match the port in the URL
        pathname: "/**",
      },
      {
        protocol: "http", // ← changed from https to http
        hostname: "82.165.134.157", // ← internal IP
        port: "5000", // ← must match the port in the URL
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.icon-icons.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.iconscout.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",

  webpack: (config, { dev }) => {
    if (dev) {
      config.devServer = {
        ...config.devServer,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers":
            "X-Requested-With, content-type, Authorization",
        },
      };
    }
    return config;
  },
};

export default nextConfig;
