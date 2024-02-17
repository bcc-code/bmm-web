<script setup lang="ts">

const { currentTrack } = useNuxtApp().$mediaPlayer;

</script>
<template>
  <select
    v-model="contentLanguageStore().selectedLanguage"
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
