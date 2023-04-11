<script lang="ts" setup></script>

<template>
  <div class="locale-changer">
    <select v-model="$i18n.locale">
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
