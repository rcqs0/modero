import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
// import theme from './theme'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'
import 'primeicons/primeicons.css'
import './style.css'
import main from './main.vue'
import router from './router'

const app = createApp(main)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(PrimeVue, {
  theme: {
    preset: definePreset(Aura, {
      semantic: {
        primary: {
          50: '{teal.50}',
          100: '{teal.100}',
          200: '{teal.200}',
          300: '{teal.300}',
          400: '{teal.400}',
          500: '{teal.500}',
          600: '{teal.600}',
          700: '{teal.700}',
          800: '{teal.800}',
          900: '{teal.900}',
          950: '{teal.950}',
        },
        colorScheme: {
          light: {
            surface: {
              0: '#ffffff',
              50: '{neutral.50}',
              100: '{neutral.100}',
              200: '{neutral.200}',
              300: '{neutral.300}',
              400: '{neutral.400}',
              500: '{neutral.500}',
              600: '{neutral.600}',
              700: '{neutral.700}',
              800: '{neutral.800}',
              900: '{neutral.900}',
              950: '{neutral.950}',
            },
          },
          dark: {
            surface: {
              0: '#ffffff',
              50: '{neutral.50}',
              100: '{neutral.100}',
              200: '{neutral.200}',
              300: '{neutral.300}',
              400: '{neutral.400}',
              500: '{neutral.500}',
              600: '{neutral.600}',
              700: '{neutral.700}',
              800: '{neutral.800}',
              900: '{neutral.900}',
              950: '{neutral.950}',
            },
          },
        },
      },
    }),
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities',
      },
    },
  },
})

app.mount('#app')
