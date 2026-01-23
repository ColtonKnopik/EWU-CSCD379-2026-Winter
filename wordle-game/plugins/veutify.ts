import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        theme: {
            defaultTheme: 'light',
            themes: {
                light: {
                    colors: {
                        primary: '#6aaa64',
                        secondary: '#c9b458',
                        background: '#ffffff',
                    },
                },
                dark: {
                    colors: {
                        primary: '#6aaa64',
                        secondary: '#c9b458',
                        background: '#121213',
                    },
                },
            },
        },
    })

    app.vueApp.use(vuetify)
})