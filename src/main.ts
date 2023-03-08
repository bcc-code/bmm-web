import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import config from '../src/config.json'
import { createAuth0 } from '@auth0/auth0-vue';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export const app = createApp(App);
app.use(pinia)

if (config.auth0) {
    app.use(
      createAuth0({
        clientId: config.auth0.client_id,
        domain: config.auth0.domain,
        cacheLocation: 'localstorage',
        useRefreshTokens: true,
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: config.auth0.audience,
          scope: config.auth0.scope,
        },
      }),
    )
  }

app.mount('#app')