// See https://nextjs.org/docs/pages/api-reference/config/next-config-js for more about configuration files.

import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const config = {
    reactStrictMode: true,
} satisfies NextConfig;

export default withMDX(config);
