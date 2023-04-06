# BMM Nuxt experiment

I wanted to try implementing the new BMM project in Nuxt instead of pure Vite, as I really enjoy the conventions of Nuxt and all the nice DX that comes out of them.

### Devtools

The Nuxt Devtools provide a useful overview of the whole app. You can see all routes, components and composables used in the project, where they are used and so on. You can also jump directly to a component definition in VSCode by clicking on the component in the devtools.

![Nuxt Devtools](https://user-images.githubusercontent.com/18753964/230243188-9e4f1d45-f0fc-403d-80b7-7d44df47677a.gif)

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

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
