import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import main from './main.vue'
import router from './router'

const app = createApp(main)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')
