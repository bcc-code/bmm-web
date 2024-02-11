<script setup lang="ts">
defineSlots<{
  default: (props: {}) => any;
}>();

const elRef = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const contentIsTooLarge = ref<boolean>(false);
const mutationObserver = ref<MutationObserver | null>(null);
const speed = 50; // in pixel per second
const delay = 2000; // in millisecons
const bufferSpace = 5; // Only start marquee if content exceepds parent by this amount of pixels

const onSlotContentChange = () => {
  if (!elRef.value?.parentElement || !container.value) return;

  const { scrollWidth } = container.value;
  const { clientWidth } = elRef.value.parentElement;

  elRef.value.style.animation = "";

  if (scrollWidth > clientWidth + bufferSpace) {
    contentIsTooLarge.value = true;
    setTimeout(() => {
      elRef.value!.style.animation = `vue-component-text-marquee ${scrollWidth * (1 / speed)}s linear infinite`;
    }, delay);
  } else {
    contentIsTooLarge.value = false;
  }
};

onMounted(() => {
  mutationObserver.value = new MutationObserver(onSlotContentChange);

  mutationObserver.value.observe(container.value!, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  onSlotContentChange();
});

onUnmounted(() => {
  mutationObserver.value?.disconnect();
});
</script>
<template>
  <div ref="elRef" class="w-fit flex relative">
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
