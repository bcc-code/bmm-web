import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import designColors from "./assets/design-tokens/tailwind-colors.generated";
import designTypography from "./assets/design-tokens/tailwind-typography.generated";

const config: Partial<Config> = {
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    colors: {
      ...designColors,
    },
    extend: {
      gridTemplateColumns: {
        tracklist: "min-content auto auto auto min-content",
      },
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      addComponents(designTypography);
    }),
  ],
};

export default config;
