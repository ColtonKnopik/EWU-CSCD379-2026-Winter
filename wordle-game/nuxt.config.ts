import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
    // Compatibility & devtools
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },

    // Turn off SSR for static SPA
    ssr: false,

    // Add this for static generation
    nitro: {
        preset: 'static'
    },

    // Build settings
    build: {
        transpile: ['vuetify'],
    },

    // Modules
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                config.plugins?.push(vuetify({ autoImport: true }))
            })
        },
    ],

    // Vite settings
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },

    css: ['@mdi/font/css/materialdesignicons.css'],

    // Base URL for static assets
    app: {
        baseURL: '/',
        buildAssetsDir: '_nuxt/'
    },
})