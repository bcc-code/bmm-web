<script setup lang="ts">
import type { DiscoverCollectionElement } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  title: string;
  element: DiscoverCollectionElement;
}>();
</script>
<template>
  <div
    class="flex gap-4 rounded-xl border border-label-separator bg-background-2 px-4 py-2"
  >
    <NuxtIcon
      name="icon.sort"
      class="drag-handle cursor-ns-resize text-label-4"
    />
    <div>
      <p class="type-subtitle-2 mb-2 text-label-3">{{ title }}</p>

      <!-- Standard fields -->
      <div
        class="flex gap-2 [&>*]:rounded-md [&>*]:bg-background-1 [&>*]:px-2 [&>*]:py-0.5"
      >
        <span v-if="element.id">ID: {{ element.id }}</span>
        <span v-if="element.client">Client: {{ element.client }}</span>
        <span v-if="element.hideBefore">
          Hide before: {{ element.hideBefore.toLocaleString() }}
        </span>
        <span v-if="element.hideAfter">
          Hide after: {{ element.hideAfter.toLocaleString() }}
        </span>
        <span v-if="element.churchUid">Church: {{ element.churchUid }}</span>
        <span v-if="element.experimentId">
          Experiment: {{ element.experimentId }}
        </span>
        <span v-if="element.userGroup">Usergroup: {{ element.userGroup }}</span>
      </div>

      <!-- Custom fields -->
      <slot />
    </div>
  </div>
</template>
