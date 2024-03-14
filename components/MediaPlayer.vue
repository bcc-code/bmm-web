<script setup lang="ts">
import { MediaPlayerStatus } from "~/plugins/mediaPlayer/mediaPlayer";

const { t } = useI18n();

const open = ref(false);

const {
  status,
  play,
  pause,
  currentTrack,
  currentPosition,
  currentTrackDuration,
  isLoading,
  queue,
  next,
  hasNext,
  previous,
  hasPrevious,
  rewind,
  fastForward,
} = useNuxtApp().$mediaPlayer;

defineShortcuts({
  " ": {
    handler: () => {
      if (status.value !== MediaPlayerStatus.Playing) play();
      else pause();
    },
  },
  ctrl_arrowleft: () => previous(), // on mac this shortcut is used to switch between spaces
  ctrl_shift_arrowleft: () => previous(),
  ctrl_arrowright: () => next(),
  ctrl_shift_arrowright: () => next(),
});

const onPointerUpProgressBar = (event: PointerEvent) => {
  const rect = (event.currentTarget as Element)?.getBoundingClientRect();
  currentPosition.value =
    ((event.clientX - rect.left) / rect.width) * currentTrackDuration.value;
};
const onPointerDownProgressBar = () => {
  // TODO: let user drag the progress-bar on mouse-down,
  // update the time while keeping the song playing,
  // and update the players position only on mouse-up.
};
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="translate-y-[80vh]"
    leave-active-class="transition-all z-20 duration-500 ease-out"
    leave-to-class="translate-y-[80vh]"
  >
    <div
      v-if="!open"
      class="group fixed bottom-5 right-5 w-[400px]"
      @click.stop="open = !open"
    >
      <svg
        class="absolute left-0 top-0 opacity-0 group-hover:opacity-100 group-hover:-left-1 group-hover:-top-1 transition-all duration-200 ease-out"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="11"
        height="11"
        viewBox="0 0 11 11"
      >
        <path
          d="M0 1.5C0 0.671573 0.671573 0 1.5 0H7.37868C8.71504 0 9.38429 1.61571 8.43934 2.56066L2.56066 8.43934C1.61572 9.38428 0 8.71504 0 7.37868V1.5Z"
          fill="currentColor"
        />
      </svg>
      <div
        class="shadow-player relative overflow-hidden flex flex-col rounded-2xl bg-background-1 p-3"
      >
        <div class="flex gap-4">
          <CoverImage
            :src="currentTrack?.meta?.attachedPicture"
            class="rounded-md h-[48px]"
          />
          <div
            class="flex gap-1 w-full flex-col overflow-hidden whitespace-nowrap"
          >
            <div class="w-full truncate">
              <h3
                class="truncate text-lg font-semibold leading-tight"
                :title="currentTrack?.title || ''"
              >
                {{ currentTrack?.title }}
              </h3>
            </div>
            <div class="w-full truncate text-base leading-snug text-label-2">
              <span
                v-if="currentTrack?.meta?.artist"
                :title="currentTrack?.meta?.artist"
              >
                {{ currentTrack.meta?.artist }}
              </span>
              <span
                v-if="currentTrack?.meta?.artist && currentTrack?.meta?.album"
              >
                -
              </span>
              <span
                v-if="currentTrack?.meta?.album"
                :title="currentTrack?.meta?.album"
              >
                {{ currentTrack.meta?.album }}
              </span>
            </div>
          </div>
          <button
            v-if="isLoading"
            class="flex aspect-square w-12 text-2xl justify-center items-center"
          >
            <NuxtIcon name="icon.loading.animation" filled />
          </button>
          <button
            v-if="!isLoading && status === MediaPlayerStatus.Playing"
            class="flex aspect-square w-12 text-3xl transition-all duration-200 ease-out hover:text-4xl justify-center items-center"
            @click.stop="pause()"
          >
            <NuxtIcon name="icon.pause.large" />
          </button>
          <button
            v-if="!isLoading && status !== MediaPlayerStatus.Playing"
            class="flex aspect-square w-12 text-3xl transition-all duration-200 ease-out hover:text-4xl justify-center items-center"
            @click.stop="play()"
          >
            <NuxtIcon name="play" />
          </button>
        </div>
        <svg
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="absolute bottom-0 left-1 right-1 w-full h-1 hover:h-1.5 transition-all duration-200 ease-out"
          @pointerdown="onPointerDownProgressBar"
          @pointerup="onPointerUpProgressBar"
          @click.stop
        >
          <rect width="100%" height="100%" class="fill-background-2" />
          <rect
            v-if="
              Number.isFinite(currentPosition) &&
              Number.isFinite(currentTrackDuration)
            "
            :width="(currentPosition / currentTrackDuration) * 100 + '%'"
            height="100%"
            class="fill-label-1"
          />
        </svg>
      </div>
    </div>
  </Transition>

  <div v-if="open" class="min-w-[400px] ml-5"></div>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="translate-y-[80vh]"
    leave-active-class="transition-all z-30 duration-500 ease-out"
    leave-to-class="translate-y-[80vh]"
  >
    <div
      v-if="open"
      class="shadow-player h-100 fixed bottom-5 right-5 flex flex-col rounded-2xl bg-background-1 w-[400px]"
    >
      <div class="px-3 py-6">
        <div class="flex items-center justify-center h-60">
          <div class="relative z-10 overflow-hidden">
            <CoverImage
              :src="currentTrack?.meta?.attachedPicture"
              class="rounded-md w-40"
            />
          </div>
          <ProtectedImage
            v-if="currentTrack?.meta?.attachedPicture"
            :src="currentTrack?.meta?.attachedPicture"
            class="absolute top-[59px] z-0 w-[160px] blur-[80px]"
            no-border
          />
        </div>
        <div
          class="flex flex-col py-3 gap-1 overflow-x-hidden whitespace-nowrap"
        >
          <TextMarquee class="m-auto">
            <h3
              class="text-lg font-semibold leading-tight"
              :title="currentTrack?.title || ''"
            >
              {{ currentTrack?.title }}
            </h3>
          </TextMarquee>
          <div
            class="overflow-x-hidden whitespace-nowrap text-base leading-snug text-label-2"
          >
            <TextMarquee class="m-auto">
              <span
                v-if="currentTrack?.meta?.artist"
                :title="currentTrack?.meta?.artist"
              >
                {{ currentTrack.meta?.artist }}
              </span>
              <span
                v-if="currentTrack?.meta?.artist && currentTrack?.meta?.album"
              >
                -
              </span>
              <span
                v-if="currentTrack?.meta?.album"
                :title="currentTrack?.meta?.album"
              >
                {{ currentTrack.meta?.album }}
              </span>
            </TextMarquee>
          </div>
        </div>
        <div class="px-4 py-2">
          <div class="py-2 group h-3 flex items-center">
            <svg
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="width-full rounded-full overflow-hidden w-full h-2 group-hover:h-3 transition-all duration-200 ease-out"
              @pointerdown="onPointerDownProgressBar"
              @pointerup="onPointerUpProgressBar"
              @click.stop
            >
              <rect width="100%" height="100%" class="fill-background-2" />
              <rect
                v-if="
                  Number.isFinite(currentPosition) &&
                  Number.isFinite(currentTrackDuration)
                "
                :width="(currentPosition / currentTrackDuration) * 100 + '%'"
                height="100%"
                class="fill-label-1"
              />
            </svg>
          </div>
          <div class="flex justify-between py-0.5 text-sm">
            <span>
              <TimeDuration :duration="currentPosition"></TimeDuration
            ></span>
            <span>
              <TimeDuration
                :duration="
                  Math.max(
                    Math.floor(currentTrackDuration) - currentPosition,
                    0,
                  )
                "
              ></TimeDuration
            ></span>
          </div>
        </div>
        <div class="flex justify-evenly px-4 py-2">
          <button
            :class="isLoading ? 'text-label-4 ' : 'hover:text-3xl border'"
            class="flex rounded-full aspect-square w-14 text-2xl transition-all duration-200 ease-out justify-center items-center border-label-separator"
            @click.stop="rewind()"
          >
            <NuxtIcon name="icon.rewind.large" filled />
          </button>
          <button
            :class="
              !hasPrevious || isLoading
                ? 'text-label-4'
                : 'hover:text-3xl bg-background-2'
            "
            class="flex rounded-full aspect-square w-14 text-2xl transition-all duration-200 ease-out justify-center items-center"
            @click.stop="previous()"
          >
            <NuxtIcon name="icon.previous.track.large" filled />
          </button>

          <button
            v-if="isLoading"
            class="flex rounded-full aspect-square bg-background-2 w-14 text-2xl justify-center items-center"
          >
            <NuxtIcon name="icon.loading.animation" filled />
          </button>
          <button
            v-if="!isLoading && status === MediaPlayerStatus.Playing"
            class="flex rounded-full aspect-square bg-background-2 w-14 text-3xl transition-all duration-200 ease-out hover:text-4xl justify-center items-center"
            @click.stop="pause()"
          >
            <NuxtIcon name="icon.pause.large" />
          </button>
          <button
            v-if="!isLoading && status !== MediaPlayerStatus.Playing"
            class="flex rounded-full aspect-square bg-background-2 w-14 text-3xl transition-all duration-200 ease-out hover:text-4xl justify-center items-center"
            @click.stop="play()"
          >
            <NuxtIcon name="play" />
          </button>
          <button
            :class="
              !hasNext || isLoading
                ? 'text-label-4'
                : 'hover:text-3xl bg-background-2'
            "
            class="flex rounded-full aspect-square w-14 text-2xl transition-all duration-200 ease-out justify-center items-center"
            @click.stop="next()"
          >
            <NuxtIcon name="icon.next.track.large" filled />
          </button>

          <button
            :class="
              currentPosition >= currentTrackDuration || isLoading
                ? 'text-label-4'
                : 'hover:text-3xl border-background-2 border'
            "
            class="flex rounded-full aspect-square w-14 text-2xl transition-all duration-200 ease-out justify-center items-center"
            @click.stop="fastForward()"
          >
            <NuxtIcon name="icon.skip.large" filled />
          </button>
        </div>
        <div class="flex justify-between absolute z-10 top-4 left-4 right-4">
          <div>
            <div
              class="rounded-full border border-label-separator p-1.5 cursor-pointer"
              @click.stop="open = !open"
            >
              <NuxtIcon name="icon.minify" filled class="text-xl" />
            </div>
          </div>
          <div
            v-if="(currentTrack?.languages?.length || 0) > 1"
            class="text-sm"
          >
            <TrackChangeLocale />
          </div>
          <div>
            <TrackMenu
              v-if="currentTrack"
              :track="currentTrack"
              button-class="rounded-full border border-label-separator p-1.5"
            ></TrackMenu>
          </div>
        </div>
      </div>
      <hr class="border-label-separator" />
      <div class="overflow-y-scroll">
        <div class="flex justify-between items-center pb-1 pt-4 px-6">
          <div class="text-label-3">{{ t("player.queue") }}</div>
          <div class="flex gap-2">
            <button
              class="rounded-full p-2 transition-all duration-200 ease-out hover:opacity-75"
              :class="
                queue.isShuffled
                  ? 'bg-background-4 text-on-color-1'
                  : 'text-label-1'
              "
              @click.stop="
                () => (queue.isShuffled ? queue.unshuffle() : queue.shuffle())
              "
            >
              <NuxtIcon name="icon.shuffle" class="text-2xl" />
            </button>
            <button
              class="rounded-full p-2 transition-all duration-200 ease-out hover:opacity-75"
              :class="
                queue.isRepeatEnabled
                  ? 'bg-background-4 text-on-color-1'
                  : 'text-label-1'
              "
              @click.stop="queue.isRepeatEnabled = !queue.isRepeatEnabled"
            >
              <NuxtIcon name="icon.repeat" filled class="text-2xl" />
            </button>
          </div>
        </div>
        <ul class="px-3 pb-3">
          <li v-for="(item, i) in queue" :key="i" @click="queue.index = i">
            <div
              :class="
                queue.index === i ? 'bg-tint hover:bg-tint text-black-1' : ''
              "
              class="rounded-xl px-3 py-2 flex justify-between gap-2 cursor-pointer hover:bg-background-2 transition-all duration-500 ease-out"
            >
              <div class="truncate">
                <div>{{ item.meta?.title || item.title }}</div>
                <div
                  class="text-sm"
                  :class="queue.index === i ? 'text-black-2' : 'text-label-2'"
                >
                  <span v-if="item?.meta?.artist">
                    {{ item.meta?.artist }}
                  </span>
                  <span v-if="item?.meta?.artist && item?.meta?.album">
                    -
                  </span>
                  <span v-if="item?.meta?.album">
                    {{ item.meta?.album }}
                  </span>
                </div>
              </div>

              <div class="flex justify-between gap-2">
                <TrackMenu :track="item"></TrackMenu>
                <NuxtIcon
                  v-if="
                    queue.index === i && status !== MediaPlayerStatus.Stopped
                  "
                  name="icon.playing.animation"
                  filled
                  class="text-2xl"
                  :class="{
                    'animation-paused': status !== MediaPlayerStatus.Playing,
                  }"
                />
              </div>
            </div>

            <hr
              v-if="!(queue.index - 1 === i || queue.index === i)"
              class="border-label-separator"
            />
          </li>
        </ul>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.shadow-player {
  max-height: calc(100vh - 1.25rem - 4.5rem);

  box-shadow:
    0px 4px 12px 0px rgba(0, 0, 0, 0.05),
    0px 1px 4px 0px rgba(0, 0, 0, 0.05),
    0px 0px 0px 1px rgba(0, 0, 0, 0.05);
}
.dark .shadow-player {
  box-shadow:
    0px 4px 12px 0px rgba(255, 255, 255, 0.05),
    0px 1px 4px 0px rgba(255, 255, 255, 0.05),
    0px 0px 0px 1px rgba(255, 255, 255, 0.05);
}
</style>
