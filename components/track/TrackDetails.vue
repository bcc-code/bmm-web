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

type Field = {
  label: string;
  text: string;
};

const extractFields = (track: TrackModel) => {
  const items: Field[] = [];

  if (track.meta?.album)
    items.push({ label: t("track.details.album"), text: track.meta?.album });
  if (track.publishedAt)
    items.push({
      label: t("track.details.publish-date"),
      text: formatDate(track.publishedAt),
    });

  items.push({
    label: t("track.details.duration"),
    text: formatTime(defaultFileForTrack(track)?.duration || 0),
  });
  if (track.songbookRelations && track.songbookRelations.length > 0)
    items.push({
      label: t("track.details.song-number"),
      text: track.songbookRelations
        ?.map((r) => `${songbookName(r.name)} ${r.id}`)
        .join(", "),
    });
  if (track.contributors) {
    const lyricists = track.contributors.filter((c) => c.type === "lyricist");
    if (lyricists.length > 0)
      items.push({
        label: t("track.details.lyricist"),
        text: lyricists?.map((c) => c.name).join(", "),
      });
    const composers = track.contributors.filter((c) => c.type === "composer");
    if (composers.length > 0)
      items.push({
        label: t("track.details.composer"),
        text: composers?.map((c) => c.name).join(", "),
      });
    const arrangers = track.contributors.filter((c) => c.type === "arranger");
    if (arrangers.length > 0)
      items.push({
        label: t("track.details.arranger"),
        text: arrangers?.map((c) => c.name).join(", "),
      });
  }
  if (track.publisher)
    items.push({
      label: t("track.details.publisher"),
      text: track.publisher,
    });
  if (track.copyright)
    items.push({ label: t("track.details.copyright"), text: track.copyright });
  return items;
};
</script>

<template>
  <div class="relative flex items-center justify-normal gap-4" v-bind="$attrs">
    <CoverImage :src="coverForTrack(track)" class="w-24 rounded-md" />
    <div>
      <h3 class="py-1 text-2xl font-extrabold text-label-1">
        {{ track.title }}
      </h3>
      <div class="text-[1.1rem] text-label-2">
        {{ track.meta?.artist }}
      </div>
    </div>
  </div>
  <br />

  <template v-if="track.externalRelations?.length ?? 0 > 0">
    <hr class="h-[2px] border-0 bg-background-2" />
    <div class="py-4 text-lg">
      <div>
        <b>{{ t("track.details.reference") }}</b>
      </div>
      <div>
        <NuxtLink
          v-for="reference in track.externalRelations?.filter((x) => x.url)"
          :key="reference.url || ''"
          :to="parseLink(reference.url || '')"
          :target="isInternalLink(reference.url || '') ? '_self' : '_blank'"
          class="my-2 flex flex-row gap-2 rounded-2xl bg-background-2 p-3 text-2xl"
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
    <hr class="h-[2px] border-0 bg-background-2" />
  </template>

  <template v-for="(field, index) in extractFields(track)" :key="index">
    <hr class="h-[2px] border-0 bg-background-2" />
    <div class="flex py-4 text-lg">
      <div class="w-40 shrink-0">
        <b>{{ field.label }}</b>
      </div>
      <div class="text-label-2">{{ field.text }}</div>
    </div>
  </template>
</template>
