import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { onAuthStateChanged } from "firebase/auth";
import { firebaseApp, auth } from './firebaseConfig'
import { VueFire, VueFireAuth } from 'vuefire'

const app = createApp(App)

app.use(VueFire, { 
  firebaseApp, 
  modules: [
    VueFireAuth()
  ]
})

app.use(router)
app.mount('#app')
