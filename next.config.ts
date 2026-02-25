import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Disable Turbopack due to Windows PostCSS bug
  // https://github.com/vercel/next.js/issues/XXXXX
};

export default withNextIntl(nextConfig);
