<script lang="ts" setup>
const profileStore = useProfileStore();
</script>

<template>
  <div v-if="!profileStore.hasDisabledDownloadPromo" class="h-[160px]">
    <div class="promo-shadow absolute bottom-3 left-3 right-3 text-black-1">
      <div class="flex flex-col gap-2 border-b-2 border-label-separator p-3">
        <div class="flex justify-between">
          <NuxtIcon name="icon.download" class="text-2xl" />
          <NuxtIcon
            name="icon.close.small"
            class="cursor-pointer text-2xl text-black-3"
            @click="profileStore.hasDisabledDownloadPromo = true"
          />
        </div>
        <div class="type-title-1">
          {{ $t("download.get-for-desktop") }}
        </div>
      </div>
      <NuxtLink
        :to="{ name: 'download' }"
        class="group flex justify-between p-3"
      >
        <div class="type-subtitle-1">
          {{ $t("download.download-now") }}
        </div>
        <NuxtIcon
          name="icon.chevron.right-1"
          class="mr-2 text-2xl transition-transform group-hover:translate-x-2"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.promo-shadow {
  /* This is different from Figma since using a gradient border doesn't give the desired result. */
  border: 1px solid transparent;
  border-radius: 12px;
  background: rgb(164, 225, 106);
  background-image: linear-gradient(var(--bmm-tint), var(--bmm-tint)),
    linear-gradient(to top, rgba(0, 0, 0, 0.2), transparent);
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-shadow:
    0px 4px 12px 0px #0000000d,
    0px 1px 4px 0px #0000000d,
    0px 0px 0px 1px #0000000d;
}
</style>
