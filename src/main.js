import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { EasyVhip } from 'vhip-easybuild-api/src/index'

const app = createApp(App);

app.use(EasyVhip, {
    autoConnect: false
});

app.mount('#app');