import type {
  ComponentCustomOptions as _ComponentCustomOptions,
  ComponentCustomProperties as _ComponentCustomProperties,
} from "vue";

declare module "@vue/runtime-core" {
  type ComponentCustomProperties = _ComponentCustomProperties;
  type ComponentCustomOptions = _ComponentCustomOptions;
}
