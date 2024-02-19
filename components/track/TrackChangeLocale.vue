<script setup lang="ts">
import { LanguageEnum } from "@bcc-code/bmm-sdk-fetch";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

const expanded = ref(false);
const { currentTrack, replaceCurrent } = useNuxtApp().$mediaPlayer;
const { t } = useI18n();

const changeLanguage = async (lang: LanguageEnum) => {
  expanded.value = false;
  if (!currentTrack.value) return;

  try {
    const reloadedTrack = await useTrackIDWithLanguage(lang, {
      id: currentTrack.value.id,
    });
    if (!reloadedTrack.data.value) return;
    replaceCurrent(reloadedTrack.data.value);
  } catch (error) {
    console.error(error);
  }
};

const trackLanguages = currentTrack?.value?.languages || [];

const getUserLanguages = () => {
  const contentLangs = contentLanguageStore()
    .contentLanguages as LanguageEnum[];
  return contentLangs.filter((lang) => trackLanguages.includes(lang));
};

const getAvailableLanguages = () => {
  const returnLanguages = [...getUserLanguages()];
  trackLanguages.forEach((lang) => {
    if (returnLanguages.includes(lang)) {
      return;
    }
    returnLanguages.push(lang);
  });

  return returnLanguages;
};
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
      class="rounded-full p-1"
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
          v-for="(lang, i) in expanded || getAvailableLanguages().length <= 5
            ? getAvailableLanguages()
            : getUserLanguages()"
          :key="`Lang${i}`"
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
        <divide-label-separator
          v-if="expanded"
          class="w-full h-0.5 bg-background-2"
        ></divide-label-separator>
        <MenuItem
          v-if="!expanded && getAvailableLanguages().length > 5"
          as="li"
          class="block w-full cursor-pointer rounded-lg text-label-1 hover:bg-background-2 hover:text-black"
          @click.stop
        >
          <button
            class="flex w-full items-center justify-start gap-2 px-3 py-2"
            @click.stop="expanded = true"
          >
            {{ t("track.dropdown.show-all") }}
            <NuxtIcon
              name="icon.chevron.down"
              class="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </button>
        </MenuItem>
      </div>
    </MenuItems>
  </Menu>
</template>
