/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
}

export default nextConfig
