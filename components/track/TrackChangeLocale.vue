<script setup lang="ts">
import { LanguageEnum } from "@bcc-code/bmm-sdk-fetch";

const { currentTrack } = useNuxtApp().$mediaPlayer;
const uiLanguage: LanguageEnum = (<any>LanguageEnum)[
  useNuxtApp().$i18n.locale.value
];

const trackLanguage: Ref<LanguageEnum> = ref(
  currentTrack?.value?.language || uiLanguage,
);
watch(trackLanguage, (_, newLang) => {
  if (!currentTrack?.value) return;
  currentTrack.value.language = newLang;
});
</script>
<template>
  <select
    v-model="trackLanguage"
    class="text-black-1 bg-background-1 dark:bg-background-3 dark:text-black-1 min-w-[100px] pl-3 py-2.5 shadow ring-1 ring-label-separator rounded-lg"
  >
    <option
      v-for="(lang, i) in currentTrack?.languages"
      :key="`Lang${i}`"
      :value="lang"
    >
      {{ lang ? getLocalizedLanguageName(lang) : "" }}
    </option>
  </select>
</template>
