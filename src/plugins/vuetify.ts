import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

export function creerVuetify(couleurPrimaire: string, couleurSecondaire: string) {
  return createVuetify({
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi }
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: couleurPrimaire,
            secondary: couleurSecondaire,
            background: '#F3EFE3',
            surface: '#FFFFFF',
            error: couleurSecondaire,
            success: couleurPrimaire,
            'market-amber': '#E8A93B'
          }
        },
        sidebar: {
          dark: true,
          colors: {
            primary: couleurPrimaire,
            secondary: couleurSecondaire,
            background: '#232821',
            surface: '#232821',
            error: couleurSecondaire,
            success: couleurPrimaire
          }
        }
      }
    },
    defaults: {
      VCard: { rounded: 'lg' },
      VBtn: { rounded: 'lg', style: 'letter-spacing: 0.02em;' }
    }
  })
}