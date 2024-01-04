<script setup lang="ts">
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();

defineProps<{
  track: TrackModel;
}>();
</script>

<template>
  <div class="relative flex items-center justify-normal gap-3">
    <div v-if="track.meta?.attachedPicture" class="relative w-24">
      <ProtectedImage
        :src="track.meta?.attachedPicture"
        alt=""
        class="aspect-square w-24 rounded-md bg-background-2"
      />
    </div>
    <div class="py-4 text-lg">
      {{ track.title }}
      <div class="text-on-color-2">
        {{ track.meta?.artist }}
      </div>
    </div>
  </div>
  <br />
  <hr class="bg-background-2 border-0 h-[2px]" />
  <div class="py-4 text-lg flex">
    <div class="w-40">
      <b>{{ t("track.details.album") }}</b>
    </div>
    <div>{{ track.meta?.album }}</div>
  </div>
  <hr class="bg-background-2 border-0 h-[2px]" />
  <div class="py-4 text-lg flex">
    <div class="w-40">
      <b>{{ t("track.details.publish-date") }}</b>
    </div>
    <div>
      {{ track.publishedAt?.toLocaleDateString() }}
    </div>
  </div>
  <hr class="bg-background-2 border-0 h-[2px]" />
  <div class="py-4 text-lg flex">
    <div class="w-40">
      <b>{{ t("track.details.duration") }}</b>
    </div>
    <TimeDuration
      :duration="((track.media || [])[0]?.files || [])[0]?.duration || 0"
    ></TimeDuration>
  </div>
  <hr class="bg-background-2 border-0 h-[2px]" />
  <div class="py-4 text-lg flex">
    <div class="w-40">
      <b>{{ t("track.details.publisher") }}</b>
    </div>
    <div>
      {{ track.publisher }}
    </div>
  </div>
  <hr class="bg-background-2 border-0 h-[2px]" />
  <div class="py-4 text-lg flex">
    <div class="w-40">
      <b>{{ t("track.details.copyright") }}</b>
    </div>
    <div>
      {{ track.copyright }}
    </div>
  </div>
</template>
