import typescript from "rollup-plugin-typescript2";

export default {
    input: "src/index.ts",
    external: id => id !== "tslib" && !/^(\.?\/|\w:)/.test(id),
    output: [
        { file: "dist/index.cjs", format: "cjs", sourcemap: true },
        { dir: "./dist", format: "es", sourcemap: true }
    ],
    plugins: [typescript()]
};