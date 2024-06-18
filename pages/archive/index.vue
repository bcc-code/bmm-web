<script setup lang="ts">
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.archive"));

const { data: years } = useYearList();
</script>

<template>
  <div>
    <div class="h-3"></div>
    <div class="columns-2 md:columns-3 xl:columns-4 2xl:columns-5">
      <NuxtLink
        v-for="(year, i) in years?.toReversed()"
        :key="`year${i}`"
        :to="{ name: 'archive-year', params: { year: year.year } }"
        class="mx-8 flex flex-row items-center justify-center rounded-xl hover:bg-background-2"
      >
        <div class="type-subtitle-1 px-2 py-2">{{ year.year }}</div>
      </NuxtLink>
    </div>
  </div>
</template>
