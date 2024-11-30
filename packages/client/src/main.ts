import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import './style.css'
import main from './main.vue'
import router from './router'

import 'remixicon/fonts/remixicon.css'

const app = createApp(main)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(PrimeVue, {
  theme: 'none',
})

app.mount('#app')
