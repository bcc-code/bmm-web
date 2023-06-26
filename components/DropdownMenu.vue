<script lang="ts" setup>
import { NuxtIconName } from "#app";
import { RoutesNamedLocations } from "~/.nuxt/typed-router/__routes";

export interface DropdownMenuItem {
  text: string;
  icon?: NuxtIconName;
  link?: RoutesNamedLocations;
  clickFunction?: Function;
}

defineProps<{
  items: DropdownMenuItem[];
}>();

const emit = defineEmits<{ close: [] }>();

function close(event: Event) {
  event.stopPropagation();
  emit("close");
}

// menu items
function menuItemClick(event: Event, item: DropdownMenuItem) {
  close(event);

  if (item.clickFunction) {
    item.clickFunction();
  }
}

function menuItemComponent(item: DropdownMenuItem) {
  if (item.link) return resolveComponent("NuxtLink");
  return "button";
}

function menuItemListeners(item: DropdownMenuItem) {
  const click = item.clickFunction
    ? (event: MouseEvent) => menuItemClick(event, item)
    : (event: MouseEvent) => event.stopPropagation();

  return {
    click,
  };
}
</script>

<template>
  <div>
    <ul
      class="absolute right-0 top-10 z-20 w-52 rounded-xl bg-white-1 p-1 shadow-md dark:bg-black-1"
    >
      <li
        v-for="item in items"
        :key="item.text"
        class="hover:text-black block w-full cursor-pointer rounded-lg hover:bg-background-2 hover:dark:bg-background-dark-2"
      >
        <component
          :is="menuItemComponent(item)"
          :to="item.link ? item.link : null"
          class="flex items-center justify-start gap-2 px-3 py-2"
          v-on="menuItemListeners(item)"
        >
          <NuxtIcon v-if="item.icon" :name="item.icon" />
          <span>{{ item.text }}</span>
        </component>
      </li>
    </ul>
    <div class="fixed inset-0 z-10" @click="close"></div>
  </div>
</template>
