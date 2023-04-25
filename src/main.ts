// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import directive from '@/directive/index'
import 'element-plus/dist/index.css'
import { init } from './init'
import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App)
app.use(pinia)
app.use(directive)
app.mount('#app')

init()
