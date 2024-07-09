<script lang="ts" setup>
import type { Highlighting, TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { MediaPlayerStatus } from "~/plugins/mediaPlayer/mediaPlayer";

const { t } = useI18n();
const { addNext, currentTrack, status } = useNuxtApp().$mediaPlayer;

const props = withDefaults(
  defineProps<{
    track: TrackModel;
    showThumbnail?: boolean;
    isTrackTypeKnown: boolean;
    useDailyPodcastView?: boolean | undefined;
    highlight?: Highlighting | undefined;
    addDropdownItems?: (items: DropdownMenuItem[], track: TrackModel) => void;
    isAlbumKnown?: boolean;
    origin?: string;
  }>(),
  {
    isAlbumKnown: false,
  },
);

defineSlots<{
  default: (props: {}) => any;
}>();

const emit = defineEmits<{ "play-track": [] }>();

function playTrack() {
  emit("play-track");
}

function ensureHighlightedWordIsVisible(text: string) {
  const firstHit = text.indexOf("**|");
  if (firstHit > 90) {
    const parts = text.split(" ");
    let letters = 0;
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      if (part === undefined) break;
      if (letters + part.length > firstHit) {
        return `...${parts.slice(Math.max(i - 3, 0)).join(" ")}`;
      }
      letters += part.length + 1;
    }
  }
  return text;
}

function adjustHighlightText(highlight: Highlighting) {
  if (!highlight.text) return "";
  return ensureHighlightedWordIsVisible(highlight.text)
    .replaceAll("**|", '<span class="text-utility-auto">')
    .replaceAll("**/", "</span>");
}

const fields = computed(() => {
  const parts = [
    props.track.title,
    trackSongNumber(props.track),
    props.track.meta.artist,
    props.isTrackTypeKnown || props.isAlbumKnown
      ? null
      : props.track.meta.album,
  ];
  const filtered = parts.filter(Boolean);

  if (props.useDailyPodcastView) {
    return {
      title: filtered[0],
      subtitle: weekDay(props.track.publishedAt),
      third: formatDate(props.track.publishedAt),
    };
  }

  const third = props.isTrackTypeKnown
    ? props.track.meta.album
    : props.track.subtype;
  return {
    title: filtered[0],
    subtitle: filtered.slice(1).join(" - "),
    third,
  };
});

const isPlaying = computed(() => currentTrack.value?.id === props.track.id);

const selectedTrack: Ref<TrackModel | null> = ref(null);
</script>

<template>
  <li
    class="group relative col-span-full grid cursor-pointer grid-cols-subgrid gap-3 py-3"
    @click.stop="playTrack"
  >
    <div
      class="absolute -inset-x-4 -inset-y-0 rounded-xl bg-background-2 opacity-0 group-hover:opacity-100"
    ></div>

    <div
      v-if="isPlaying"
      class="absolute -inset-x-4 -inset-y-0 rounded-xl bg-tint"
    ></div>

    <!-- eslint-disable vue/no-v-html -->
    <div class="relative col-span-full grid grid-cols-subgrid">
      <div v-if="showThumbnail" class="hidden flex-col justify-center lg:flex">
        <div class="relative aspect-square w-10">
          <CoverImage
            :src="track.meta?.attachedPicture"
            class="w-10 rounded-md"
          />
          <div
            v-if="!isPlaying"
            class="absolute inset-0 w-10 opacity-0 group-hover:opacity-100"
          >
            <div
              class="absolute inset-0 h-full w-full rounded-md bg-black-3 opacity-50"
            ></div>
            <NuxtIcon
              name="play"
              class="absolute inset-0 flex items-center justify-center text-2xl text-white-1"
            />
          </div>
          <div v-if="isPlaying" class="absolute inset-0 w-10">
            <div
              class="absolute inset-0 h-full w-full rounded-md bg-black-3 opacity-50"
            ></div>
            <NuxtIcon
              name="icon.playing.animation"
              class="absolute inset-0 ml-1.5 flex items-center justify-center text-2xl text-white-1"
              :class="{
                'animation-paused': status !== MediaPlayerStatus.Playing,
              }"
            />
          </div>
        </div>
      </div>

      <div v-if="!showThumbnail" class="relative hidden lg:block"></div>
      <div
        class="col-span-2 flex min-w-0 flex-col justify-center lg:col-span-1"
      >
        <h4
          class="block truncate text-[17px] font-medium leading-6"
          :class="{ 'text-black-1': isPlaying }"
          :title="fields.title || ''"
        >
          {{ fields.title }}
        </h4>
        <span
          v-if="fields.subtitle"
          :title="fields.subtitle"
          class="block truncate text-[15px] leading-5"
          :class="isPlaying ? 'text-black-1' : 'text-label-2'"
        >
          {{ fields.subtitle }}
        </span>
      </div>

      <div v-if="highlight" class="hidden min-w-0 items-center xl:flex">
        <span class="flex gap-1 truncate rounded-3xl bg-[#81888F1A] px-3 py-2">
          <NuxtIcon name="icon.ai" class="text-utility-auto" />
          <div class="truncate" v-html="adjustHighlightText(highlight)"></div>
        </span>
      </div>
      <div
        v-else
        class="flex min-w-0 items-center"
        :class="highlight ? 'xl:hidden' : ''"
      >
        <span
          class="truncate"
          :class="isPlaying ? 'text-black-1' : 'text-label-3'"
          >{{ fields.third }}</span
        >
      </div>
      <div class="flex items-center">
        <span class="text-label-3">
          <TimeDuration
            :duration="defaultFileForTrack(track)?.duration || 0"
          ></TimeDuration>
        </span>
      </div>
      <div
        class="flex items-center gap-1"
        :class="isPlaying ? 'text-black-1' : 'text-label-1'"
      >
        <button
          class="rounded-full p-2 opacity-0 hover:bg-label-separator hover:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
          :aria-label="t('track.dropdown.add-to-playlist')"
          :title="t('track.dropdown.add-to-playlist')"
          @click="selectedTrack = track"
          @click.stop
        >
          <NuxtIcon name="icon.category.playlist" class="text-2xl" />
        </button>
        <button
          class="rounded-full p-2 opacity-0 hover:bg-label-separator hover:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
          :aria-label="t('track.dropdown.play-next')"
          :title="t('track.dropdown.play-next')"
          @click="addNext(track, props.origin)"
          @click.stop
        >
          <NuxtIcon name="icon.play" class="text-2xl" />
        </button>
        <TrackMenu
          :track="track"
          :button-class="
            'p-2 hover:bg-label-separator ' +
            (isPlaying ? 'text-black-1 hover:text-black-1' : 'text-label-1')
          "
          :add-dropdown-items="props.addDropdownItems"
          :origin="props.origin"
        />
      </div>
    </div>

    <div v-if="highlight" class="relative col-span-full xl:hidden">
      <div
        class="col-span-full flex max-w-full gap-1 rounded-3xl bg-[#81888F1A] px-3 py-2"
      >
        <NuxtIcon name="icon.ai" class="text-utility-auto" />
        <div
          class="truncat max-h-6 overflow-hidden"
          v-html="adjustHighlightText(highlight)"
        />
      </div>
    </div>

    <slot />

    <TrackAddToPlaylist
      v-if="selectedTrack"
      :track-id="selectedTrack.id"
      @close="selectedTrack = null"
    ></TrackAddToPlaylist>
  </li>
</template>
