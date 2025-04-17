import type { NuxtIconName } from "#build//nuxt-icons";
import type { RoutesNamedLocations } from "#build/typed-router";

export type DropdownMenuItem = {
  text: string;
  icon?: NuxtIconName;
} & (
  | { link: RoutesNamedLocations }
  | { clickFunction: Function }
  | { externalLink: string }
);
