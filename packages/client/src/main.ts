import { createApp } from 'vue'
import { createPinia } from 'pinia'
import main from './main.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import './style.css'
import 'remixicon/fonts/remixicon.css'

const app = createApp(main)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.mount('#app')
