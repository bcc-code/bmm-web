<script lang="ts" setup>
import { RoutesNamedLocations } from "~/.nuxt/typed-router/__routes";

export interface DropdownMenuItem {
  text: string;
  icon?: string;
  link?: RoutesNamedLocations;
  clickFunction?: Function;
}

defineProps<{
  items: DropdownMenuItem[];
}>();

const emit = defineEmits(["close"]);

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
      class="absolute z-40 top-10 right-0 p-1 bg-white-1 shadow-md rounded-xl w-52"
    >
      <li
        v-for="item in items"
        :key="item.text"
        class="block rounded-lg hover:bg-slate-100 hover:text-black hover:bg-background-2 cursor-pointer w-full"
      >
        <component
          :is="menuItemComponent(item)"
          :to="item.link ? item.link : null"
          class="flex justify-start items-center gap-2 py-2 px-3"
          v-on="menuItemListeners(item)"
        >
          <IconComponent v-if="item.icon" :name="item.icon" />
          <span>{{ item.text }}</span>
        </component>
      </li>
    </ul>
    <div class="fixed inset-0 z-10" @click="close"></div>
  </div>
</template>
