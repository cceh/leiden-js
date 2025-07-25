import typescript from "rollup-plugin-typescript2";

const entries = [
    "codemirror-leiden",
    "language", 
    "linter",
    "transformer",
    "util"
];

export default entries.map(entry => ({
    input: `src/${entry}/index.ts`,
    external: id => id !== "tslib" && !/^(\.?\/|\w:)/.test(id),
    output: [
        { 
            file: `dist/${entry}/index.cjs`, 
            format: "cjs", 
            sourcemap: true 
        },
        { 
            file: `dist/${entry}/index.js`, 
            format: "es", 
            sourcemap: true 
        }
    ],
    plugins: [
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    declaration: true,
                    declarationMap: true,
                    declarationDir: "dist",
                    rootDir: "src"
                }
            },
            useTsconfigDeclarationDir: true
        })
    ]
}));