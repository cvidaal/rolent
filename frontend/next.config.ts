import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita streaming metadata en el body (causa hydration mismatch en dev con Next.Metadata)
  htmlLimitedBots: /.*/,
};

export default nextConfig;
