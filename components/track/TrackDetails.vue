<script setup lang="ts">
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();

defineProps<{
  track: TrackModel;
}>();

const { locale } = useI18n();
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  };
  return new Intl.DateTimeFormat(locale.value, options).format(dateToUtc(date));
};
</script>

<template>
  <div class="relative flex items-center justify-normal gap-4">
    <ProtectedImage
      v-if="track.meta?.attachedPicture"
      :src="track.meta?.attachedPicture"
      class="aspect-square w-24 rounded-md bg-background-2"
    />
    <div>
      <h3 class="text-label-1 py-1 text-2xl font-extrabold">
        {{ track.title }}
      </h3>
      <div class="text-label-2 text-[1.1rem]">
        {{ track.meta?.artist }}
      </div>
    </div>
  </div>
  <br />
  <hr class="bg-background-2 border-0 h-[2px]" />

  <template v-if="track.externalRelations?.length ?? 0 > 0">
    <div class="py-4 text-lg">
      <div>
        <b>{{ t("track.details.reference") }}</b>
      </div>
      <div>
        <NuxtLink
          v-for="reference in track.externalRelations?.filter((x) => x.url)"
          :key="reference.url"
          :to="parseLink(reference.url || '')"
          class="bg-background-2 my-2 p-3 rounded-2xl flex flex-row gap-2 text-2xl"
        >
          <NuxtIcon
            :name="reference.hasListened ? 'icon.checkmark' : 'icon.link'"
          ></NuxtIcon>
          <div v-if="reference.name">
            <div
              v-for="(part, index) in reference.name.split(' / ')"
              :key="part"
              :class="index === 0 ? 'text-base' : 'text-sm text-label-2'"
            >
              {{ part }}
            </div>
          </div>
          <NuxtIcon name="icon.chevron.right" class="ml-auto"></NuxtIcon>
        </NuxtLink>
      </div>
    </div>
    <hr class="bg-background-2 border-0 h-[2px]" />
  </template>

  <div class="py-4 text-lg flex">
    <div class="w-40">
      <b>{{ t("track.details.album") }}</b>
    </div>
    <div class="text-label-2">{{ track.meta?.album }}</div>
  </div>
  <hr class="bg-background-2 border-0 h-[2px]" />
  <template v-if="track.publishedAt">
    <div class="py-4 text-lg flex">
      <div class="w-40 shrink-0">
        <b>{{ t("track.details.publish-date") }}</b>
      </div>
      <div class="text-label-2">
        {{ formatDate(track.publishedAt) }}
      </div>
    </div>
    <hr class="bg-background-2 border-0 h-[2px]" />
  </template>
  <div class="py-4 text-lg flex">
    <div class="w-40 shrink-0">
      <b>{{ t("track.details.duration") }}</b>
    </div>
    <TimeDuration
      :duration="((track.media || [])[0]?.files || [])[0]?.duration || 0"
      class="text-label-2"
    ></TimeDuration>
  </div>
  <hr class="bg-background-2 border-0 h-[2px]" />
  <div class="py-4 text-lg flex">
    <div class="w-40 shrink-0">
      <b>{{ t("track.details.publisher") }}</b>
    </div>
    <div class="text-label-2">
      {{ track.publisher }}
    </div>
  </div>
  <hr class="bg-background-2 border-0 h-[2px]" />
  <div class="py-4 text-lg flex">
    <div class="w-40 shrink-0">
      <b>{{ t("track.details.copyright") }}</b>
    </div>
    <div class="text-label-2">
      {{ track.copyright }}
    </div>
  </div>
</template>
