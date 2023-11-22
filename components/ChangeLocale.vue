<script lang="ts" setup></script>

<template>
  <div class="locale-changer">
    <select
      v-model="$i18n.locale"
      class="text-black-1 dark:bg-white-1 dark:text-black-1 min-w-[100px] p-2"
    >
      <option
        v-for="(lang, i) in $i18n.availableLocales"
        :key="`Lang${i}`"
        :value="lang"
      >
        {{ lang }}
      </option>
    </select>
  </div>
</template>
