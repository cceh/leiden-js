import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
    globalIgnores([
        "**/dist/",
        "packages/parser-*/types/",
        "packages/parser-*/src/parser.*",
        "test/leiden-js-idp-test-data",
        ".mocharc.cjs"
    ]),
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
    { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
    { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { stylistic } },
    tseslint.configs.recommended,
    {
        rules: {
            "no-irregular-whitespace": ["error", { skipStrings: true, skipTemplates: true }],
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "stylistic/semi": ["error", "always"],
            "stylistic/quotes": ["error", "double", { avoidEscape: true }],
            "stylistic/object-curly-spacing": ["error", "always"],
            "stylistic/arrow-spacing": ["error"]
        }
    },
]);