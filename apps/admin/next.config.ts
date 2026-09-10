import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @church/db ships raw TypeScript, so Next must compile it.
  transpilePackages: ["@church/db", "@church/puck-config"],
};

export default nextConfig;
