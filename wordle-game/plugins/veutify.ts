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
            surface: '#ffffff',
          },
        },
        dark: {
          colors: {
            primary: '#6aaa64',
            secondary: '#c9b458',

            // lighter + closer to your header vibe
            background: '#202124', // was #121213 (too dark)
            surface: '#2b2c2f',    // matches your header base

            // optional but helps contrast feel less harsh
            'on-background': '#EDEAF2',
            'on-surface': '#EDEAF2',
          },
        },
      },
    },
  })

  app.vueApp.use(vuetify)
})
