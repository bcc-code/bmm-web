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

function menuItemClick(event: Event, item: DropdownMenuItem) {
  close(event);

  if (item.clickFunction) {
    item.clickFunction();
  }
}
</script>

<template>
  <div>
    <ul
      class="absolute z-20 top-10 right-0 p-2 bg-white shadow-md rounded-lg divide-y divide-slate-100 w-52"
    >
      <li
        v-for="item in items"
        :key="item.text"
        class="block rounded-lg hover:bg-slate-100 hover:text-black cursor-pointer w-full"
      >
        <NuxtLink
          v-if="item.link"
          :to="item.link"
          class="flex justify-start items-center gap-1 py-2 px-3"
        >
          <IconComponent v-if="item.icon" :name="item.icon" />
          <span>{{ item.text }}</span>
        </NuxtLink>
        <p
          v-else-if="item.clickFunction"
          class="flex justify-start items-center gap-1 py-2 px-3"
          @click="(event: MouseEvent) => menuItemClick(event, item)"
        >
          <IconComponent v-if="item.icon" :name="item.icon" />
          <span>{{ item.text }}</span>
        </p>
        <p
          v-else
          @click="(event: MouseEvent) => event.stopPropagation()"
          class="flex justify-start items-center gap-1 py-2 px-3"
        >
          <IconComponent v-if="item.icon" :name="item.icon" />
          <span>{{ item.text }}</span>
        </p>
      </li>
    </ul>
    <div @click="close" class="fixed inset-0 z-10"></div>
  </div>
</template>
