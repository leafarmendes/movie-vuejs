import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router/index"
import moshaToast from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

import './style.css'



const app = createApp(App);
app.use(moshaToast);
app.use(store);
app.use(router);
app.mount("#app");