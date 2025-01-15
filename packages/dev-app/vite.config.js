import { defineConfig } from 'vite'

export default defineConfig(({ command }) => {
    return {
        base: command === 'build' ? '/leiden-js/' : '/',
    }
})