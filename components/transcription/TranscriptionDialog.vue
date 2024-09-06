<script setup lang="ts">
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import getSongtreasuresLink from "~/utils/songtreasures";

const props = defineProps<{
  track: TrackModel;
}>();

const show = defineModel<boolean>("show", { default: false });

const { data: transcription, execute } = useTrackTranscription({
  id: props.track.id,
});

const { $appInsights } = useNuxtApp();

watch(
  show,
  (_show) => {
    if (!_show) return;

    execute();
    $appInsights.event("Transcription dialog opened", {
      trackId: props.track.id,
      trackSubtype: props.track.subtype,
    });
  },
  { once: true },
);

const lyricists = computed(() =>
  props.track.contributors
    ?.filter((c) => c.type === "lyricist")
    .map((c) => c.name)
    .join(", "),
);

const composers = computed(() =>
  props.track.contributors
    ?.filter((c) => c.type === "composer")
    .map((c) => c.name)
    .join(", "),
);

const { t } = useI18n();

const dialogTitle = computed(() => {
  if (!trackIsSong(props.track))
    return t("transcription.auto-transcribed.title");
  return t("transcription.lyrics");
});

const dialogIcon = computed(() => {
  if (!trackIsSong(props.track)) return "icon.ai";
  if (props.track.songbookRelations?.length) return "songtreasures";
  return "icon.information";
});

const showAutoTranscribeInfo = ref(false);

function onHeaderClick() {
  if (!trackIsSong(props.track)) showAutoTranscribeInfo.value = true;
}

const headerComponent = computed(() => {
  if (!trackIsSong(props.track)) return "button";
  return resolveComponent("NuxtLink");
});
</script>

<template>
  <DialogBase
    :show="show && !!transcription?.length && !showAutoTranscribeInfo"
    :title="dialogTitle"
    @close="show = false"
  >
    <template #title>
      <component
        :is="headerComponent"
        :class="[
          '-m-3 flex cursor-pointer items-center gap-2 rounded-xl p-3',
          { 'text-utility-auto': !trackIsSong(track) },
        ]"
        :to="getSongtreasuresLink(track)"
        @click="onHeaderClick"
      >
        <NuxtIcon :name="dialogIcon" />
        <span>{{ dialogTitle }}</span>
      </component>
    </template>

    <header v-if="track.subtype == 'song'" class="mb-6">
      <h2 class="type-heading-2 mb-2 text-label-1">{{ track.title }}</h2>
      <p
        v-if="track.contributors?.length"
        class="type-paragraph-2 flex flex-wrap items-center gap-x-1 text-label-3"
      >
        <span>{{ $t("track.details.lyricist") }}: {{ lyricists }}</span> •
        <span>{{ $t("track.details.composer") }}: {{ composers }}</span> •
        <span>{{ track.copyright }}</span>
      </p>
    </header>
    <TransitionGroup
      tag="ul"
      tabindex="0"
      enter-active-class="transition duration-200 ease-out delay-[var(--delay)]"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
    >
      <p
        v-for="item in transcription"
        :key="item.id"
        :class="[
          'relative z-10 whitespace-pre text-pretty text-label-2 after:absolute after:bottom-0 after:left-0 after:-z-10 after:h-full after:bg-tint after:transition-all after:duration-[1000ms] after:ease-out-expo',
          { 'my-4': track.subtype == 'song' },
        ]"
      >
        {{ item.text }}
      </p>
    </TransitionGroup>
  </DialogBase>
  <DialogPlain
    :show="showAutoTranscribeInfo"
    @close="showAutoTranscribeInfo = false"
  >
    <div class="flex max-w-[480px] flex-col items-center gap-6 p-8 text-center">
      <div class="type-title-1 text-utility-auto">
        <NuxtIcon name="icon.ai" class="type-heading-3 mb-1" />
        <span>{{ t("transcription.auto-transcribed.title") }}</span>
      </div>
      <h2 class="type-heading-3 text-balance text-label-1">
        {{ t("transcription.auto-transcribed.explanation") }}
      </h2>
      <ButtonStyled @click="showAutoTranscribeInfo = false">
        <span>{{ t("transcription.auto-transcribed.confirmation") }}</span>
      </ButtonStyled>
    </div>
  </DialogPlain>
</template>
