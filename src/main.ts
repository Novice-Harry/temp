import { createApp } from 'vue'
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

import BaiduMap from 'vue-baidu-map-3x'

import App from './App.vue'
import router from './router'

// import { quillEditor } from 'vue3-quill'

import './assets/normalize.css'
import './assets/common.css'

const app = createApp(App)

// app.use(quillEditor)

app.use(createPinia().use(persist))
app.use(BaiduMap, {
  ak: 'QGgQgA6ViRqguZM1eKuRh14w5t3LOAsd'
})
app.use(router)

app.mount('#app')
