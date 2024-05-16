<script setup lang="ts">
import * as slider from "@zag-js/slider";
import { normalizeProps, useMachine } from "@zag-js/vue";

const { volume } = useNuxtApp().$mediaPlayer;

const [volumeState, volumeSend] = useMachine(
  slider.machine({
    id: "volume",
    value: [volume.value * 100],
    onValueChange(details) {
      const [value] = details.value;
      if (value) volume.value = value / 100;
    },
  }),
);
const volumeSlider = computed(() =>
  slider.connect(volumeState.value, volumeSend, normalizeProps),
);
const setVolume = (value: number) => {
  volume.value = value;
  volumeSlider.value.setValue([value * 100]);
};
</script>
<template>
  <div class="px-4 pb-2 pt-5" v-bind="volumeSlider.rootProps">
    <div
      class="group/volume flex items-center gap-3 rounded-3xl border border-label-separator px-[16px] py-[1px]"
    >
      <NuxtIcon
        name="icon.audio.off"
        class="my-1.5 cursor-pointer text-2xl"
        @click.stop="setVolume(0)"
      />
      <div
        class="h-8 w-full transition-all duration-200 group-hover/volume:h-9"
      >
        <div
          v-bind="volumeSlider.controlProps"
          class="h-full cursor-pointer py-3"
        >
          <div class="h-full overflow-hidden rounded-full">
            <div
              v-bind="volumeSlider.trackProps"
              class="h-full cursor-pointer bg-background-2"
            >
              <div
                v-bind="volumeSlider.rangeProps"
                class="h-full cursor-pointer bg-label-1"
              />
            </div>
          </div>
          <div
            v-for="(_, index) in volumeSlider.value"
            :key="index"
            v-bind="volumeSlider.getThumbProps({ index })"
          >
            <input v-bind="volumeSlider.getHiddenInputProps({ index })" />
          </div>
        </div>
      </div>
      <NuxtIcon
        name="icon.audio.on"
        class="cursor-pointer text-2xl"
        @click.stop="setVolume(1)"
      />
    </div>
  </div>
</template>
