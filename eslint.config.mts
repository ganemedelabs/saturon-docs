// See https://eslint.org/docs/latest/use/configure/configuration-files for more about configuration files.

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        ignores: ["node_modules/**", ".next/**", "out/**", "build/**", ".source/**", "next-env.d.ts"],
    },
    {
        rules: {
            indent: ["warn", 4],
            quotes: ["warn", "double"],
            "@typescript-eslint/ban-ts-comment": "off",
        },
    },
];

export default eslintConfig;
