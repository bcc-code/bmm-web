<script setup lang="ts">
import type { LanguageEnum } from "@bcc-code/bmm-sdk-fetch";

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
    // TODO: Show an error message to the user
    console.error(error);
  }
};

const trackLanguages = computed(() => currentTrack?.value?.languages || []);

const userLanguages = computed(() =>
  useContentLanguageStore().contentLanguages.filter((lang) =>
    trackLanguages.value.includes(lang),
  ),
);
const remainingLanguages = computed(() =>
  trackLanguages.value.filter((lang) => !userLanguages.value.includes(lang)),
);
</script>
<template>
  <DropdownMenu placement="bottom" @click.stop>
    <button
      :aria-label="t('track.a11y.options')"
      class="rounded-full border border-label-separator px-3 py-1.5 font-semibold hover:bg-background-2"
    >
      {{ getLocalizedLanguageName(currentTrack?.language || "") }}
    </button>

    <template #items>
      <DropdownMenuGroup>
        <DropdownMenuItem
          v-for="lang in userLanguages"
          :key="lang"
          :title="getLocalizedLanguageName(lang)"
          @click="changeLanguage(lang)"
        />
      </DropdownMenuGroup>
      <DropdownMenuGroup
        v-if="trackLanguages.length > 5"
        class="transition-all duration-500 ease-out-expo"
        :class="{
          'h-12 max-h-12': !expanded,
          'h-96 max-h-96': expanded,
        }"
      >
        <DropdownMenuItem
          v-if="trackLanguages.length > 5"
          :title="t('track.dropdown.show-all')"
          @click.prevent.stop="expanded = !expanded"
        >
          <template #right>
            <NuxtIcon
              name="icon.chevron.down"
              class="ml-auto text-xl text-label-1 transition-transform duration-200 ease-out-expo"
              aria-hidden="true"
              :class="{ 'rotate-180 transform': expanded }"
            />
          </template>
        </DropdownMenuItem>
        <template v-if="expanded || !(trackLanguages.length > 5)">
          <DropdownMenuItem
            v-for="lang in remainingLanguages"
            :key="lang"
            :title="getLocalizedLanguageName(lang)"
            @click="changeLanguage(lang)"
          />
        </template>
      </DropdownMenuGroup>
    </template>
  </DropdownMenu>
</template>
