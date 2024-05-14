import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/style/index.scss'
import './index.css'
import router from "./router"
import i18n from './third/i18n/i18n'

createApp(App).use(i18n).use(router).mount('#app')
