<script lang="ts" setup>
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();

defineProps<{
  track: TrackModel;
  showThumbnail?: boolean;
}>();

const emit = defineEmits(["open-options", "play-track"]);

function openOptions(event: Event) {
  event.stopPropagation();
  emit("open-options");
}

function playTrack() {
  emit("play-track");
}
</script>

<template>
  <li class="group relative mr-3 cursor-pointer py-3" @click="playTrack">
    <div
      class="absolute -inset-x-4 -inset-y-0 rounded-xl bg-background-2 opacity-0 group-hover:opacity-100"
    ></div>
    <div class="relative flex items-center justify-between gap-3">
      <div
        v-if="track.meta?.attachedPicture && showThumbnail"
        class="relative w-10"
      >
        <ProtectedImage
          :src="track.meta?.attachedPicture"
          alt=""
          class="aspect-square w-10 rounded-md bg-background-2"
        />
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100">
          <div
            class="absolute inset-0 h-full w-full rounded-md bg-black-1 opacity-50"
          ></div>
          <IconComponent
            name="play"
            filled
            class="absolute inset-0 flex items-center justify-center text-2xl text-white-1"
          />
        </div>
      </div>
      <div class="mr-auto w-1/3">
        <h4
          class="overflow-hidden text-ellipsis whitespace-nowrap font-semibold"
          :title="track.meta?.title || ''"
        >
          {{ track.meta?.title }}
        </h4>
        <span
          v-if="track.meta?.artist"
          :title="track.meta?.artist"
          class="block overflow-hidden text-ellipsis whitespace-nowrap text-label-1"
        >
          {{ track.meta?.artist }}
        </span>
      </div>
      <div
        v-if="!(track.meta?.attachedPicture && showThumbnail)"
        class="block h-1 w-10"
      ></div>
      <div>
        <span class="text-label-2">{{ track.subtype }}</span>
      </div>
      <div class="ml-auto">
        <span class="text-label-2">{{ track.meta?.time }}</span>
      </div>
      <div class="ml-auto flex items-center justify-center gap-1">
        <button
          class="px-2 py-0 opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
          :aria-label="t('track.a11y.download')"
        >
          <IconComponent name="download" filled class="text-2xl" />
        </button>
        <button
          class="px-2 py-0 opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
          :aria-label="t('track.a11y.queue')"
        >
          <IconComponent name="queue" filled class="text-2xl" />
        </button>
        <button
          :aria-label="t('track.a11y.options')"
          class="focus:bg-lime-400 rounded-lg px-2 py-0"
          @click="openOptions"
        >
          <IconComponent name="options" filled class="text-2xl" />
        </button>
      </div>
    </div>
    <slot />
  </li>
</template>
