<script lang="ts" setup>
import { NuxtIconName } from "#build/nuxt-icons";
import { RoutesNamedLocations } from "@typed-router";

export type DropdownMenuItem = {
  text: string;
  icon?: NuxtIconName;
} & ({ link: RoutesNamedLocations } | { clickFunction: Function });

defineProps<{
  items: DropdownMenuItem[];
}>();

const emit = defineEmits<{ close: [] }>();

function close() {
  emit("close");
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
        @click.stop="close"
      >
        <NuxtLink
          v-if="'link' in item"
          class="flex items-center justify-start gap-2 px-3 py-2"
          :to="item.link"
        >
          <NuxtIcon v-if="item.icon" :name="item.icon" />
          <span>{{ item.text }}</span>
        </NuxtLink>
        <button
          v-else
          class="flex items-center justify-start gap-2 px-3 py-2"
          @click="item.clickFunction?.()"
        >
          <NuxtIcon v-if="item.icon" :name="item.icon" />
          <span>{{ item.text }}</span>
        </button>
      </li>
    </ul>
    <div class="fixed inset-0 z-10" @click.stop="close"></div>
  </div>
</template>
