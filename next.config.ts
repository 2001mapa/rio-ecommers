import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'tu-proyecto-supabase.supabase.co', // Para cuando subas tus fotos reales
      }
    ],
  },
};

export default nextConfig;