<script setup lang="ts">
const { t } = useI18n();

const colorModes = ["system", "light", "dark"] as const;
const getColorModeName = (mode: (typeof colorModes)[number]) => {
  switch (mode) {
    case "system":
      return t("profile.theme-system");
    case "dark":
      return t("profile.theme-dark");
    default:
      return t("profile.theme-light");
  }
};
</script>

<template>
  <header
    class="sticky top-0 z-10 flex justify-between border-b border-label-separator bg-white-2 px-6 py-4 backdrop-blur-md dark:bg-black-2"
  >
    <strong v-if="toolbarTitleStore().toolbarTitle" class="text-label-1">
      {{ toolbarTitleStore().toolbarTitle }}
    </strong>

    <div class="flex flex-row">
      <select
        v-model="$colorMode.preference"
        class="mx-4 bg-white-1 text-black-1 dark:bg-white-1 dark:text-black-1"
      >
        <option
          v-for="(mode, $index) in colorModes"
          :key="$index"
          :value="mode"
        >
          {{ getColorModeName(mode) }}
        </option>
      </select>
      <ChangeLocale class="mx-4" />
      <ProfileMenu />
    </div>
  </header>
</template>
