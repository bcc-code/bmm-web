import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    LOGIN_USERNAME: "",
    LOGIN_PASSWORD: "",
  },

  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
