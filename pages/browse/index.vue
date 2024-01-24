<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.browse"));

const { data: models, pending } = useBrowse();
</script>

<template>
  <div>
    <template v-if="pending">
      <ul>
        <li
          v-for="index in 5"
          :key="index"
          class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2"
        ></li>
      </ul>
    </template>
    <template v-else>
      <DocumentModels v-if="models !== null" :models="models"></DocumentModels>
    </template>
  </div>
</template>
