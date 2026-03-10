<script lang="ts" setup>
import { TrackApi } from "@bcc-code/bmm-sdk-fetch";
import type { AchievementModel, ProjectBoxV2 } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  item: ProjectBoxV2;
}>();

const selectedAchievement = ref<AchievementModel>();
const showDialog = computed({
  get() {
    return selectedAchievement.value !== undefined;
  },
  set(value) {
    if (value === false) {
      selectedAchievement.value = undefined;
    }
  },
});

const { $mediaPlayer } = useNuxtApp();
async function playTrackWithId(trackId: number) {
  const track = await new TrackApi().trackIdGet({ id: trackId });
  $mediaPlayer.replaceCurrent(track);
  setTimeout(() => {
    $mediaPlayer.open.value = true;
  }, 100);
}

const trackIsPlaying = computed(() => {
  if (!$mediaPlayer.currentTrack.value) return false;
  if (!selectedAchievement.value) return false;
  return (
    $mediaPlayer.currentTrack.value.id === selectedAchievement.value.trackId
  );
});
</script>

<template>
  <div class="col-span-full my-4 rounded-2xl bg-background-2">
    <div class="p-4">
      <h3 v-if="item.title" class="type-title-2">
        {{ item.title }}
      </h3>
      <p class="type-subtitle-2 text-label-3">
        {{ item.pointsDescription }}
      </p>
    </div>
    <div class="flex gap-4 overflow-auto py-4 pt-0">
      <button
        v-for="achievement in item.achievements"
        :key="achievement.id!"
        class="size-16 first:ml-4 last:mr-4 md:size-20"
        @click="selectedAchievement = achievement"
      >
        <ProtectedImage :src="achievement.url!" :title="achievement.title!" />
      </button>
    </div>
    <DialogBase
      v-if="selectedAchievement"
      :show="showDialog"
      :title="$t('project.achievement')"
      @close="showDialog = false"
    >
      <div
        class="flex max-w-lg flex-col items-center justify-center p-6 text-center"
      >
        <ProtectedImage :src="selectedAchievement.url!" class="mb-6 size-32" />
        <span
          v-if="selectedAchievement.hasAchieved"
          class="type-subtitle-2 text-label-3"
        >
          {{ $t("project.achievementUnlocked") }}
        </span>
        <p class="type-heading-2 my-2">{{ selectedAchievement.title }}</p>
        <p class="text-balance">{{ selectedAchievement.description }}</p>

        <div
          v-if="selectedAchievement.trackId"
          class="mt-6 flex w-full flex-col gap-2"
        >
          <ButtonStyled
            :disabled="trackIsPlaying"
            size="large"
            :icon="trackIsPlaying ? 'icon.playing.animation' : 'icon.play'"
            @click="playTrackWithId(selectedAchievement.trackId)"
          >
            {{ $t("project.achievementPlayNext") }}
          </ButtonStyled>
        </div>
      </div>
    </DialogBase>
  </div>
</template>
