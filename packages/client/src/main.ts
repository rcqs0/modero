import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from './presets/aura'
import 'primeicons/primeicons.css'
import './style.css'
import main from './main.vue'
import router from './router'

const app = createApp(main)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(PrimeVue, {
  unstyled: true,
  pt: Aura,
})

app.mount('#app')
