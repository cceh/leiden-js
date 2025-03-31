import typescript from "rollup-plugin-typescript2";
import { dts } from "rollup-plugin-dts";

export default [{
    input: "src/parser.js",
    //external: id => id !== "tslib" && !/^(\.?\/|\w:)/.test(id),
    external(id) {
        return !/^[./]/.test(id);
    },
    output: [
        { file: "dist/index.cjs", format: "cjs" },
        { file: "dist/index.js", format: "es", }
    ],
    plugins: [
        typescript({ include: ["src/**/*.js"], useTsconfigDeclarationDir: true })
    ]
}, {
    input: "types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()]

    }
];