<script setup lang="ts">
import { PublishedFilter } from "@bcc-code/bmm-sdk-fetch";
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import transcriptionStorageKey from "~/utils/transcription";

const { t } = useI18n();
setTitle(() => t("nav.transcribe"));

const { data: tracks } = useTracks({ publishedFilter: PublishedFilter.Show });

definePageMeta({
  middleware: ["transcription-manager"],
});

type TranscriptionStatus = "not-started" | "in-progress" | "done";

function transcriptionStatus(track: TrackModel): TranscriptionStatus {
  const localTranscription = localStorage.getItem(
    transcriptionStorageKey(track.id, track.language),
  );
  const hasSavedTranscription = Boolean(
    localStorage.getItem(
      `${transcriptionStorageKey(track.id, track.language)}:saved`,
    ),
  );

  if (hasSavedTranscription) return "done";
  if (localTranscription?.length) return "in-progress";
  return "not-started";
}

const translations: Record<TranscriptionStatus, string> = {
  done: t("transcription.status.done"),
  "in-progress": t("transcription.status.in-progress"),
  "not-started": t("transcription.status.not-started"),
};
</script>

<template>
  <div>
    <PageHeading>{{ t("nav.transcribe") }}</PageHeading>
    <ul
      class="grid grid-cols-[auto_1fr_auto_auto] divide-y divide-label-separator"
    >
      <li
        v-for="track in tracks"
        :key="track.id"
        class="col-span-full grid grid-cols-subgrid items-center justify-between gap-4 py-4"
      >
        <p class="type-title-2">{{ track.title }}</p>
        <time
          class="type-subtitle-2 text-label-4"
          :datetime="track.publishedAt.toUTCString()"
        >
          {{ formatDate(track.publishedAt) }}
        </time>
        <span
          class="rounded-full border px-2 text-center data-[status='done']:text-[green] data-[status='in-progress']:text-[orange] data-[status='not-started']:text-label-4"
          :data-status="transcriptionStatus(track)"
        >
          {{ translations[transcriptionStatus(track)] }}
        </span>
        <NuxtLink :to="{ name: 'transcribe-id', params: { id: track.id } }">
          <ButtonStyled intent="primary">
            {{ $t("transcription.review") }}
          </ButtonStyled>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
