import { createApp } from "vue";
import { createAuth0 } from '@auth0/auth0-vue';
import "./style.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App)

app.use(router)

console.log('Domain for auth0 is', import.meta.env.VITE_AUTH_URL)

app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH_URL,
    clientId: import.meta.env.VITE_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audeince: 'https://bmm-api.brunstad.org'
    }
  })
);

app.mount("#app")