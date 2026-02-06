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

// Runtime config for API connection
runtimeConfig: {
    public: {
        apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5000/api'
    }
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
        buildAssetsDir: '_nuxt/',
        head: {
            title: 'Starfall Dominion',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'A tactical strategy game on a hexagonal battlefield' }
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
            ]
        }
    },
})