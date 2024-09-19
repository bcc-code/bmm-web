<script setup lang="ts">
const { t } = useI18n();
setTitle(() => t("nav.transcribe"));

const { data: tracks } = useTracks();
</script>

<template>
  <div>
    <PageHeading>{{ t("nav.transcribe") }}</PageHeading>
    <ul class="space-y-4">
      <li
        v-for="track in tracks"
        :key="track.id"
        class="flex items-center justify-between gap-4"
      >
        {{ track.title }}
        <NuxtLink :to="{ name: 'transcribe-id', params: { id: track.id } }">
          <ButtonStyled>Review</ButtonStyled>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
