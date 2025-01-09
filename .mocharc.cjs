module.exports = {
    require: ['ts-node/register', './node_modules/tsconfig-paths/register.js'],
    extensions: ['js', 'ts'],
    // spec: ['test/**/*.test.ts'],
    "node-option": ["loader=ts-node/esm"]
};