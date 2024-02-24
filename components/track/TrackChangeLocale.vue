<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

const expanded = ref(false);
const { currentTrack, replaceCurrent } = useNuxtApp().$mediaPlayer;
const { t } = useI18n();

const changeLanguage = async (lang: string) => {
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

const trackLanguages: string[] = currentTrack?.value?.languages || [];

const getUserLanguages = () => {
  const contentLangs = contentLanguageStore().contentLanguages;
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
const getRemainingLanguages = () => {
  const userLanguages = getUserLanguages();
  return trackLanguages.filter((lang) => !userLanguages.includes(lang));
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
      class="py-1.5 px-3 font-semibold hover:bg-background-2 rounded-full border border-label-separator"
    >
      {{
        currentTrack?.language
          ? getLocalizedLanguageName(currentTrack.language)
          : ""
      }}
    </MenuButton>

    <MenuItems
      as="ul"
      class="absolute right-[-100px] left-[-100px] mx-auto top-10 z-30 w-60 rounded-xl p-1 shadow-md bg-background-3 max-h-[500px] overflow-y-auto"
    >
      <div class="py-0">
        <MenuItem
          v-for="(lang, i) in getUserLanguages()"
          :key="`Lang${i}`"
          as="li"
          class="block w-full cursor-pointer rounded-lg text-label-1 hover:bg-background-2"
        >
          <button
            class="flex w-full items-center justify-start gap-2 px-3 py-2.5 text-[15px]"
            @click="changeLanguage(lang)"
          >
            <span>{{ lang ? getLocalizedLanguageName(lang) : "" }}</span>
          </button>
        </MenuItem>
        <div class="px-3">
          <hr v-if="true" class="bg-label-separator text-label-separator" />
        </div>
        <MenuItem
          v-if="!expanded && getAvailableLanguages().length > 5"
          as="li"
          class="block w-full cursor-pointer rounded-lg text-label-1 hover:bg-background-2"
          @click.stop
        >
          <button
            class="flex w-full items-center justify-start gap-2 px-3 py-2.5 text-[15px]"
            @click.stop="expanded = true"
          >
            {{ t("track.dropdown.show-all") }}
            <NuxtIcon
              name="icon.chevron.down"
              class="ml-auto text-label-1 text-xl"
              aria-hidden="true"
            />
          </button>
        </MenuItem>
        <template v-if="expanded || !(getAvailableLanguages().length > 5)">
          <MenuItem
            v-for="(lang, i) in getRemainingLanguages()"
            :key="`Lang${i}`"
            as="li"
            class="block w-full cursor-pointer rounded-lg text-label-1 hover:bg-background-2"
          >
            <button
              class="flex w-full items-center justify-start gap-2 px-3 py-2.5 text-[15px]"
              @click="changeLanguage(lang)"
            >
              <span>{{ lang ? getLocalizedLanguageName(lang) : "" }}</span>
            </button>
          </MenuItem>
        </template>
      </div>
    </MenuItems>
  </Menu>
</template>
