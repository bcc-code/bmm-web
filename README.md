# bmm-web

This repository will be used for a new website for https://bmm.brunstad.org using VueJS.
In a later stage we want to use the same code to create a desktop app.

This repository uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Running

```
pnpm i
pnpm dev
```

_Note:_ If you had an error in your code and the system still shows you the error but you've already fixed it, consider running `pnpm clean`. If you have this problem often, consider contacting one of the maintainers of the project.

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
