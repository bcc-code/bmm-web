import { relative, resolve } from "node:path";
/* eslint-disable import/no-extraneous-dependencies */
import { defineNuxtModule } from "@nuxt/kit";
import logSymbols from "log-symbols";

export default defineNuxtModule({
  meta: {
    name: "@bmm-web/figma2tailwind",
  },
  async setup(_, nuxt) {
    async function runConverter() {
      try {
        await (await import("./convertToTailwind")).default();
        console.log(
          logSymbols.success,
          `Tailwind classes generated from figma tokens 🎨`,
        );
      } catch (e) {
        console.error(
          logSymbols.error,
          `Failed to generate tailwind classes from figma tokens 🎨`,
          e,
        );
      }
    }

    nuxt.hook("builder:watch", async (__, path) => {
      const relativePath = relative(
        nuxt.options.srcDir,
        resolve(nuxt.options.srcDir, path),
      );
      if (relativePath === "assets/design-tokens/tokens.json") {
        await runConverter();
      }
    });

    await runConverter();
  },
});
