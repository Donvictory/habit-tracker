import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "export" because Vercel supports Next.js natively, 
  // and static export can break Next.js App Router client-side navigations.
};

export default nextConfig;
