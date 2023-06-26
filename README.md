# bmm-web

This repository will be used for a new website for https://bmm.brunstad.org using [Nuxt 3](https://nuxt.com/docs/getting-started/introduction).
In a later stage we want to use the same code to create a desktop app.

This repository uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Develop

```
pnpm i

## Website
pnpm dev

## App
pnpm dev:electron
```

_Note:_ If you had an error in your code and the system still shows you the error but you've already fixed it, consider running `pnpm clean`. If you have this problem often, consider contacting one of the maintainers of the project.

## Build

```
pnpm i

## Website
pnpm build

## App
pnpm build:electron
npx electron-builder
```

_Note:_ The electron-builder will by default only build an app for the current platform and current architecture. If you want to go beyond, please visit https://www.electron.build/multi-platform-build.html.

_Note:_ Electron registers a handler for the url-scheme `bmm` on start, which means that after starting the electron-app in dev-mode or a new build, the system will always use this instance for opening links with the scheme `bmm`. This might be desirable while testing. Keep in mind to start your installed version of the bmm-electron app when you're done, so it can re-register as handler of the `bmm` scheme and deep-links will open with the installed version of the app.

## E2E testing

Prepare by having a version of this project running. You may use `pnpm preview` to run the tests against a build locally or `pnpm dev`. The command `pnpm e2e` will start an interactive version of cypress.

You may create the file `cypress.env.json` to set e.g. the username and password used for testing.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + Plugins and configuration provided by `.vscode/extensions.json` and `.vscode/settings.json`

## Type Support For `.vue` Imports in TS

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Creating a new electron build

Please see the [Electron documentation on the GitHub Release Workflow](https://www.electron.build/configuration/publish.html#recommended-github-releases-workflow).

- The new release in Github should be called the same as version in package.json (e.g. 0.0.5)
- The tag of the release should be 'v0.0.5' and 'Create new tag: v0.0.5 on publish' needs to be set
- Save Release as draft

That way every new build will update the binaries of the release above. Once the version is ready, it will create the correct tag in git.
