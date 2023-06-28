/* eslint-disable import/prefer-default-export */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Nuxt } from "@nuxt/schema";
import { addTemplate } from "@nuxt/kit";

export const saveGeneratedFile = (_: Nuxt, iconNames: string[] | null) => {
  addTemplate({
    filename: "nuxt-icons.d.ts",
    getContents: () => `export type NuxtIconName = ${
      iconNames === null
        ? "string"
        : iconNames.map((p) => `"${p.replace(/[\\"]/g, "\\$&")}"`).join(" | ")
    }
`,
  });
};
