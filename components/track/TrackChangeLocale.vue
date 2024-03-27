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
    // TODO: Show an error message to the user
    console.error(error);
  }
};

const trackLanguages =
  currentTrack?.value?.languages?.map((lang) => lang.toString()) || [];

const getUserLanguages = () =>
  contentLanguageStore().contentLanguages.filter((lang) =>
    trackLanguages.includes(lang),
  );
const getRemainingLanguages = () => {
  const userLanguages = getUserLanguages();
  return trackLanguages.filter((lang) => !userLanguages.includes(lang));
};
</script>
<template>
  <Menu
    as="div"
    class="relative flex flex-col justify-center text-left"
    @click.stop
  >
    <MenuButton
      as="button"
      :aria-label="t('track.a11y.options')"
      class="rounded-full border border-label-separator px-3 py-1.5 font-semibold hover:bg-background-2"
    >
      {{ getLocalizedLanguageName(currentTrack?.language || "") }}
    </MenuButton>

    <MenuItems
      as="ul"
      class="absolute left-[-100px] right-[-100px] top-10 z-30 mx-auto max-h-[500px] overflow-y-auto whitespace-nowrap rounded-xl bg-background-3 p-1 shadow-md"
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
            <span>{{ getLocalizedLanguageName(lang) }}</span>
          </button>
        </MenuItem>
        <div v-if="trackLanguages.length > 5" class="px-3">
          <hr class="bg-label-separator text-label-separator" />
        </div>
        <MenuItem
          v-if="!expanded && trackLanguages.length > 5"
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
              class="ml-auto text-xl text-label-1"
              aria-hidden="true"
            />
          </button>
        </MenuItem>
        <template v-if="expanded || !(trackLanguages.length > 5)">
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
              <span>{{ getLocalizedLanguageName(lang) }}</span>
            </button>
          </MenuItem>
        </template>
      </div>
    </MenuItems>
  </Menu>
</template>
