<script lang="ts" setup>
import { ref } from "vue";
import toolbarTitleStore from "@/stores/toolbarTitle";

// TODO: Replace placeholder by profile menu #8
const showMenu = ref(false);
function toggleMenu() {
  showMenu.value = !showMenu.value;
}
</script>

<template>
  <header
    class="py-4 px-5 sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 leading-none flex justify-between align-center"
  >
    <strong>{{ toolbarTitleStore().toolbarTitle }}</strong>
    <div class="relative">
      <button @click="toggleMenu">{{ $t("nav.profile") }}</button>
      <div
        v-if="showMenu"
        class="p-2 rounded-lg border border-gray-100 bg-white absolute"
      >
        test
      </div>
    </div>
  </header>
</template>
