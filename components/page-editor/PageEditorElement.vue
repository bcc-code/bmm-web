<script setup lang="ts">
import type { DiscoverCollectionElement } from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  title: string;
  element: DiscoverCollectionElement;
}>();

function formatForDateTimeLocal(date: Date | undefined | null) {
  if (!date) return "";
  const _date = new Date(date);
  // Get local date/time components
  const year = _date.getFullYear();
  const month = String(_date.getMonth() + 1).padStart(2, "0");
  const day = String(_date.getDate()).padStart(2, "0");
  const hours = String(_date.getHours()).padStart(2, "0");
  const minutes = String(_date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
</script>
<template>
  <div
    class="flex gap-4 rounded-xl border border-label-separator bg-background-2 px-4 py-2"
  >
    <NuxtIcon
      name="icon.sort"
      class="drag-handle cursor-ns-resize text-label-4"
    />
    <div class="grid w-full grid-cols-[auto_1fr] gap-y-2">
      <p class="type-subtitle-2 col-span-full text-label-3">{{ title }}</p>

      <!-- Standard fields -->
      <PageEditorFieldset title="Standard">
        <div class="flex w-full gap-x-4">
          <PageEditorInput
            label="Disabled"
            type="checkbox"
            v-model="element.disabled"
          />
          <PageEditorInput
            label="Feature preview only"
            type="checkbox"
            v-model="element.featurePreviewOnly"
          />
        </div>
        <PageEditorInput
          label="Platform"
          type="select"
          v-model="element.client"
          :options="['app', 'web', 'ios', 'android', null]"
        />
        <PageEditorInput
          label="Hide before"
          type="datetime-local"
          :model-value="formatForDateTimeLocal(element.hideBefore)"
          @update:model-value="
            (value) =>
              typeof value == 'string'
                ? (element.hideBefore = new Date(value))
                : (element.hideBefore = value as any)
          "
        />
        <PageEditorInput
          label="Hide after"
          type="datetime-local"
          :model-value="formatForDateTimeLocal(element.hideAfter)"
          @update:model-value="
            (value) =>
              typeof value == 'string'
                ? (element.hideBefore = new Date(value))
                : (element.hideBefore = value as any)
          "
        />
        <PageEditorInput label="Church ID" v-model="element.churchUid" />
        <PageEditorInput label="Experiment ID" v-model="element.experimentId" />
        <PageEditorInput label="Usergroup" v-model="element.userGroup" />
        <PageEditorInput
          label="Min age"
          type="number"
          v-model="element.minAge"
        />
        <PageEditorInput
          label="Max age"
          type="number"
          v-model="element.maxAge"
        />
        <PageEditorInput
          label="Min BMM version"
          v-model="element.minBmmVersion"
        />
        <PageEditorInput
          label="Max BMM version"
          v-model="element.maxBmmVersion"
        />
      </PageEditorFieldset>

      <!-- Custom fields -->
      <PageEditorFieldset v-if="$slots.default" title="Other">
        <slot />
      </PageEditorFieldset>
    </div>
  </div>
</template>
