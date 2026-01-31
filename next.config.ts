import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingRoot: __dirname,
  output: "standalone" // For API Routes in AWS Amplify
};

export default nextConfig;