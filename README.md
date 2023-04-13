# BMM Nuxt experiment

I wanted to try implementing the new BMM project in Nuxt instead of pure Vite, as I really enjoy the conventions of Nuxt and all the nice DX that comes out of them.

## Why?

Nuxt does have a multitude of conventions and utilities to make fullstack development with Vue as easy as possible:

- **[File-based routing](https://nuxt.com/docs/getting-started/routing)**  
You can also [define you own route-config](https://nuxt.com/docs/guide/going-further/custom-routing)
- **Built-in composables for [data fetching and caching](https://nuxt.com/docs/getting-started/data-fetching)**
- **Built-in composables for [state management](https://nuxt.com/docs/getting-started/state-management)**
- **It handles SSR if that is relevant**  
You can [disable SSR on a per-route basis](https://nuxt.com/docs/guide/concepts/rendering#route-rules)

### Devtools

The Nuxt Devtools provide a useful overview of the whole app. You can see all routes, components and composables used in the project, where they are used and so on. You can also jump directly to a component definition in VSCode by clicking on the component in the devtools.

![Nuxt Devtools](https://user-images.githubusercontent.com/18753964/230243188-9e4f1d45-f0fc-403d-80b7-7d44df47677a.gif)

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

### Environment variables

For Auth0 to work you need to provide a `clientId`. This can be done in two ways:
  
  1. Put your id in `runtimeConfig.public.clientId` in `nuxt.config.ts`:
  ```ts
  // nuxt.config.ts
  export default defineConfig({
    //...
    runtimeConfig: {
      clientId: '<YOUR_CLIENT_ID>'
    },
    //...
  })
  ```

  2. Put `NUXT_PUBLIC_CLIENT_ID` in a `.env` file

If you don't provide an id you won't be able to log in.

## Development Server

Start the development server on `http://localhost:3000`

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
