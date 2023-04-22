<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.home"));

const { data: discoveries } = useDiscover();
</script>

<template>
  <div class="flex flex-col gap-16">
    <ul>
      <template v-for="item in discoveries" :key="`${item.type}_${item.id}`">
        <PageHeading v-if="item.type === 'section_header'" :level="3"
          >Title</PageHeading
        >
        <p v-else>{{ item.type }} {{ item.id }}</p>
      </template>
    </ul>
  </div>
</template>
