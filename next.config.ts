import type { NextConfig } from "next";

const pagesBasePath = process.env.PAGES_BASE_PATH ?? "";

if (pagesBasePath && !/^\/[A-Za-z0-9._-]+$/.test(pagesBasePath)) {
  throw new Error(
    "PAGES_BASE_PATH must be empty or a single path segment such as /English-Learning-App",
  );
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
