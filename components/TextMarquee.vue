<script setup lang="ts">
defineSlots<{
  default: (props: {}) => any;
}>();

const elRef = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const contentIsTooLarge = ref<boolean>(false);
const mutationObserver = ref<MutationObserver | null>(null);
const speed = 30; // in pixel per second
const delay = 2000; // in millisecons
const bufferSpace = 5; // Only start marquee if content exceepds parent by this amount of pixels

watch(contentIsTooLarge, () => {
  if (!container.value) return;

  const { scrollWidth } = container.value;

  if (contentIsTooLarge.value) {
    setTimeout(() => {
      if (!elRef.value) return;
      elRef.value!.style.animation = `vue-component-text-marquee ${scrollWidth * (1 / speed)}s linear infinite`;
    }, delay);
  } else {
    if (!elRef.value) return;
    elRef.value!.style.animation = "";
  }
});

const checkIfContentIsTooLarge = () => {
  if (!elRef.value?.parentElement || !container.value) return;

  const { scrollWidth } = container.value;
  const { clientWidth } = elRef.value.parentElement;

  contentIsTooLarge.value = scrollWidth > clientWidth + bufferSpace;
};

const onSlotContentChange = () => {
  // Reset the animation if content changed.
  elRef.value!.style.animation = "";
  contentIsTooLarge.value = false;

  setTimeout(() => {
    checkIfContentIsTooLarge();
  });
};

onMounted(() => {
  mutationObserver.value = new MutationObserver(onSlotContentChange);

  mutationObserver.value.observe(container.value!, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  onSlotContentChange();

  window.addEventListener("resize", checkIfContentIsTooLarge);
});

onUnmounted(() => {
  mutationObserver.value?.disconnect();
  window.removeEventListener("resize", checkIfContentIsTooLarge);
});
</script>
<template>
  <div
    ref="elRef"
    class="relative flex w-fit"
    :data-marquee-enabled="contentIsTooLarge ? '' : null"
  >
    <div
      ref="container"
      class="inline-block"
      :class="{ 'pr-14': contentIsTooLarge }"
    >
      <slot />
    </div>
    <div v-if="contentIsTooLarge" class="inline-block pr-14"><slot /></div>
  </div>
</template>
<style>
@keyframes vue-component-text-marquee {
  0% {
    transform: translate(0);
  }

  100% {
    transform: translate(-50%);
  }
}
</style>
