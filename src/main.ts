import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import Store from "./store";
import auth0 from "./auth0";
import i18n from "./plugins/i18n";

const app = createApp(App);

app.use(router);

app.use(auth0);

app.use(i18n);

app.provide(
  "store",
  new Store({
    loading: true,
    authenticated: false,
    token: null,
  })
);

app.mount("#app");
