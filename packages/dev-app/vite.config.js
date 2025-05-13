import { defineConfig } from "vite";
import { env } from "node:process";

export default defineConfig(({ command }) => {
    const baseUrl = env.BASE_URL
        ? (env.BASE_URL.endsWith("/") ? env.BASE_URL : `${env.BASE_URL}/`)
        : (command === "build" ? "/leiden-js/" : "/");

    return {
        base: baseUrl,
        build: {
            sourcemap: true,
        }
    };
});