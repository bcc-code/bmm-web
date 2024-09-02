<script setup lang="ts">
import * as slider from "@zag-js/slider";
import { normalizeProps, useMachine } from "@zag-js/vue";

const { currentPosition, currentTrackDuration } = useNuxtApp().$mediaPlayer;

const newPosition = ref<number | null>(null);
const [positionState, positionSend] = useMachine(
  slider.machine({
    id: "position",
    value: [0],
    step: 0.01,
    onValueChange(details) {
      const [value] = details.value;
      if (value) newPosition.value = value;
    },
    onValueChangeEnd(details) {
      const [value] = details.value;
      if (value !== undefined) {
        currentPosition.value = (value / 100) * currentTrackDuration.value;
        newPosition.value = null;
      }
    },
  }),
);
const positionSlider = computed(() =>
  slider.connect(positionState.value, positionSend, normalizeProps),
);

const currentOrNewPosition = computed(() =>
  newPosition.value === null
    ? currentPosition.value
    : (newPosition.value / 100) * currentTrackDuration.value,
);

watch([currentPosition, currentTrackDuration], () => {
  if (newPosition.value === null && currentTrackDuration.value > 0) {
    const value = (currentPosition.value / currentTrackDuration.value) * 100;
    positionSlider.value.setValue([value]);
    newPosition.value = null;
  }
});
</script>

<template>
  <div class="group/position px-4 py-2" v-bind="positionSlider.getRootProps()">
    <div class="flex items-center">
      <div class="h-7"></div>
      <div
        class="h-6 w-full transition-all duration-200 group-hover/position:h-7"
      >
        <div
          v-bind="positionSlider.getControlProps()"
          class="h-full cursor-pointer py-2"
        >
          <div class="h-full overflow-hidden rounded-full">
            <div
              v-bind="positionSlider.getTrackProps()"
              class="h-full cursor-pointer bg-background-2"
            >
              <div
                v-bind="positionSlider.getRangeProps()"
                class="h-full cursor-pointer bg-label-1"
              />
            </div>
          </div>
          <div
            v-for="(_, index) in positionSlider.value"
            :key="index"
            v-bind="positionSlider.getThumbProps({ index })"
          >
            <input v-bind="positionSlider.getHiddenInputProps({ index })" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between py-0.5 text-sm">
      <span>
        <TimeDuration :duration="currentOrNewPosition"></TimeDuration
      ></span>
      <span>
        <TimeDuration
          :duration="
            Math.max(Math.floor(currentTrackDuration) - currentOrNewPosition, 0)
          "
        ></TimeDuration
      ></span>
    </div>
  </div>
</template>
