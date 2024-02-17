<script setup lang="ts">
import { LanguageEnum } from "@bcc-code/bmm-sdk-fetch";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

const expanded = ref(false);
const { currentTrack } = useNuxtApp().$mediaPlayer;
const { t } = useI18n();

const changeLanguage = (lang: LanguageEnum) => {
  expanded.value = false;
  contentLanguageStore().selectedLanguage = lang;
};

const getSortedLanguages = () => {
  const contentLangs = contentLanguageStore()
    .contentLanguages as LanguageEnum[];
  const tempLangs = currentTrack?.value?.languages || [];
  const sortedLanguages = contentLangs.filter((lang) =>
    tempLangs.includes(lang),
  );
  tempLangs.forEach((lang) => {
    if (sortedLanguages.includes(lang)) {
      return;
    }
    sortedLanguages.push(lang);
  });

  return sortedLanguages;
};
const firstFiveLanguages = () => getSortedLanguages().slice(0, 5);
const allLanguages = () => getSortedLanguages();
</script>
<template>
  <Menu
    as="div"
    class="relative text-left flex flex-col justify-center"
    @click.stop
  >
    <MenuButton
      as="button"
      :aria-label="t('track.a11y.options')"
      class="rounded-full p-1 hover:bg-background-2 hover:text-label-1"
    >
      {{
        currentTrack?.language
          ? getLocalizedLanguageName(currentTrack.language)
          : ""
      }}
    </MenuButton>

    <MenuItems
      as="ul"
      class="absolute right-0 top-10 z-30 w-52 rounded-xl p-1 shadow-md bg-background-3"
    >
      <div class="py-0">
        <MenuItem
          v-for="(lang, i) in expanded ? allLanguages() : firstFiveLanguages()"
          :key="`Lang${i}`"
          :visible="expanded || i < 5"
          as="li"
          class="block w-full cursor-pointer rounded-lg text-label-1 hover:bg-background-2 hover:text-black"
        >
          <button
            class="flex w-full items-center justify-start gap-2 px-3 py-2"
            @click="changeLanguage(lang)"
          >
            <span>{{ lang ? getLocalizedLanguageName(lang) : "" }}</span>
          </button>
        </MenuItem>
        <MenuItem
          v-if="!expanded"
          as="li"
          class="block w-full cursor-pointer rounded-lg text-label-1 hover:bg-background-2 hover:text-black"
          @click.stop
        >
          <button
            class="flex w-full items-center justify-start gap-2 px-3 py-2"
            @click.stop="expanded = true"
          >
            {{ t("track.dropdown.show-all") }}
          </button>
        </MenuItem>
      </div>
    </MenuItems>
  </Menu>
</template>
