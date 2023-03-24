import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import Store from "./store";
import auth0 from "./auth0";

const app = createApp(App);

app.use(router);

app.use(auth0);

app.provide(
  "store",
  new Store({
    loading: true,
    authenticated: false,
    token: null,
  })
);

app.mount("#app");
