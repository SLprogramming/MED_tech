import './assets/main.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@/assets/scss/index.scss';

import VueSweetalert2 from "vue-sweetalert2"
import "sweetalert2/dist/sweetalert2.min.css"

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Heading from './components/Common/Heading.vue'
import Loading from './components/Common/Loading.vue'

const app = createApp(App)

app.component('Heading', Heading)
app.component('Loading', Loading)

app.use(VueSweetalert2)

app.use(createPinia())
app.use(router)

app.mount('#app')
