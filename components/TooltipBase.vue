<script setup lang="ts">
import {
  autoUpdate,
  offset as floatingOffset,
  useFloating,
} from "@floating-ui/vue";
import type { Placement } from "@floating-ui/vue";

const {
  placement,
  offset,
  delay = 50,
} = defineProps<{
  placement?: Placement;
  offset?: number;
  delay?: number;
}>();

const trigger = ref(null);
const floating = ref(null);
const { floatingStyles } = useFloating(trigger, floating, {
  whileElementsMounted: autoUpdate,
  placement,
  middleware: [floatingOffset(offset)],
});

const initialTick = ref(false);
nextTick(() => {
  initialTick.value = true;
});

const triggerHover = useElementHover(trigger);
const floatingHover = useElementHover(floating);

const hovering = computed(() => triggerHover.value || floatingHover.value);
const show = defineModel<boolean>({ default: false });
watch(hovering, (value) => {
  if (!value) {
    setTimeout(() => {
      if (!hovering.value) {
        show.value = false;
      }
    }, delay);
  } else {
    show.value = true;
  }
});
</script>

<template>
  <div ref="trigger">
    <slot />
    <Teleport to="body">
      <div
        v-if="initialTick"
        v-show="show"
        ref="floating"
        :style="floatingStyles"
        class="z-40"
      >
        <Transition
          enter-active-class="duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="duration-200 ease-in"
          leave-from-class="opacity-100 "
          leave-to-class="opacity-0 "
        >
          <slot v-if="show" name="content" />
        </Transition>
      </div>
    </Teleport>
  </div>
</template>
