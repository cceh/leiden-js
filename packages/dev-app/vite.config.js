import { defineConfig } from "vite";
import { env } from "node:process";

export default defineConfig(({ command }) => {
    return {
        base: env.BASE_URL || (command === "build" ? "/leiden-js/" : "/"),
        build: {
            sourcemap: true,
        }
    };
});