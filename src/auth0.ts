import { createAuth0 } from "@auth0/auth0-vue";

export default createAuth0({
  domain: import.meta.env.VITE_AUTH_URL,
  clientId: import.meta.env.VITE_CLIENT_ID,
  cacheLocation: "localstorage",
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: "https://bmm-api.brunstad.org",
  },
});
