import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'



const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia); 
const authStore = useAuthStore();
authStore.loadUserFromStorage();
app.mount("#app");
console.log(localStorage.getItem("user"));
console.log(JSON.parse(localStorage.getItem("user")));
