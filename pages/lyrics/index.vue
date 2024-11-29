<script setup lang="ts">
import { LyricsApi } from "@bcc-code/bmm-sdk-fetch";
import { useRouteQuery } from "@vueuse/router";
import type { Lyrics } from "@bcc-code/bmm-sdk-fetch";
import { DEFAULT_LONG_COPYRIGHT } from "./[id].vue";

const { t } = useI18n();
setTitle(() => t("nav.lyrics"));

const showCreateDialog = ref(false);
const createForm = reactive({
  title: "",
});

const resetForm = () => {
  createForm.title = "";
};

const items = ref<Lyrics[]>([]);
onMounted(async () => {
  items.value = await new LyricsApi().lyricsGet();
});

const loading = ref(false);
async function createLyrics() {
  loading.value = true;

  try {
    await new LyricsApi().lyricsPost({
      lyrics: {
        songTitle: createForm.title,
        source: "Manual",
        longCopyright: DEFAULT_LONG_COPYRIGHT,
      },
    });
    resetForm();
  } catch (err) {
    showErrorToUser("CreateLyricsFailed", "Failed to create lyrics");
  } finally {
    items.value = await new LyricsApi().lyricsGet();
    loading.value = false;
    showCreateDialog.value = false;
  }
}

const search = useRouteQuery("search", "");

const filteredItems = computed(() => {
  if (!search.value) return items.value;
  return items.value.filter((item) =>
    item.songTitle?.toLowerCase().includes(search.value.toLowerCase()),
  );
});
</script>

<template>
  <div>
    <header class="flex items-center justify-between gap-4">
      <PageHeading>{{ t("nav.lyrics") }}</PageHeading>
      <ButtonStyled
        intent="primary"
        icon="icon.add"
        @click="showCreateDialog = true"
      >
        {{ $t("lyrics.create-new-lyrics") }}
      </ButtonStyled>
    </header>
    <div class="relative mb-4 max-w-72">
      <input
        id="search"
        v-model="search"
        class="w-full truncate rounded-lg border border-label-separator bg-background-2 px-4 py-2"
        :placeholder="$t('search.input-placeholder')"
      />
      <NuxtIcon
        name="icon.search"
        class="absolute right-4 top-1/2 -translate-y-1/2"
      />
    </div>

    <TransitionGroup
      tag="div"
      class="grid grid-cols-[1fr_auto] divide-y divide-label-separator"
      move-class="transition-all duration-500 ease-out"
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-500 ease-out absolute"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <NuxtLink
        v-for="item in filteredItems"
        :key="item.id"
        class="col-span-full grid grid-cols-subgrid items-center justify-between gap-4 py-1"
        :to="{ name: 'lyrics-id', params: { id: item.id! } }"
      >
        <p>
          <span class="type-title-2">{{ item.songTitle }}</span>
          <span class="text-label-4">&nbsp; {{ item.modifiedBy }}</span>
        </p>

        <ButtonStyled intent="secondary">
          {{ $t("lyrics.edit") }}
        </ButtonStyled>
      </NuxtLink>
    </TransitionGroup>

    <DialogBase
      :show="showCreateDialog"
      :title="$t('lyrics.create-new-lyrics')"
      hide-button
      @close="showCreateDialog = false"
    >
      <form
        class="flex flex-col gap-2 sm:min-w-96"
        @submit.prevent="createLyrics"
      >
        <div class="flex flex-col gap-1">
          <label for="lyrics-title" class="type-subtitle-2 text-label-3">
            Song title
          </label>
          <input
            id="lyrics-title"
            v-model="createForm.title"
            class="rounded-lg border border-label-separator bg-background-2 px-4 py-2"
            required
          />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <ButtonStyled
            intent="tertiary"
            type="button"
            @click="showCreateDialog = false"
          >
            {{ $t("global.cancel") }}
          </ButtonStyled>
          <ButtonStyled intent="primary" type="submit" :loading="loading">
            {{ $t("lyrics.create") }}
          </ButtonStyled>
        </div>
      </form>
    </DialogBase>
  </div>
</template>
