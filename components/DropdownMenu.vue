<script lang="ts" setup>
export interface DropdownMenuItem {
  text: string;
  link?: string;
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

const dropdownMenuItemClasses =
  "py-2 px-3 rounded-lg hover:bg-lime-400 hover:text-black cursor-pointer block";
</script>

<template>
  <div>
    <ul
      class="absolute z-20 top-10 right-0 p-2 bg-white shadow-md z-10 rounded-lg divide-y divide-slate-100 w-52"
    >
      <li v-for="item in items" :key="item.text">
        <NuxtLink
          v-if="item.link"
          :to="`${item.link}`"
          :class="dropdownMenuItemClasses"
        >
          <span>{{ item.text }}</span>
        </NuxtLink>
        <p
          v-else-if="item.clickFunction"
          :class="dropdownMenuItemClasses"
          @click="item.clickFunction"
        >
          {{ item.text }}
        </p>
        <p v-else :class="dropdownMenuItemClasses">{{ item.text }}</p>
      </li>
    </ul>
    <div @click="close" class="fixed inset-0 z-10"></div>
  </div>
</template>
