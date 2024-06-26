<script setup lang="ts">
import {
  offset,
  useFloating,
  flip,
  autoPlacement,
  autoUpdate,
  hide,
} from "@floating-ui/vue";
import type { Placement } from "@floating-ui/vue";
import {
  Menu,
  MenuButton,
  MenuItems,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";

const props = defineProps<{
  placement?: Placement;
}>();

const buttonRef = ref<null | VNode<HTMLElement>>(null);
const panelRef = ref<null | VNode<HTMLElement>>(null);

const buttonEl = computed(() => buttonRef.value?.el);
const panelEl = computed(() => panelRef.value?.el);

const { floatingStyles, middlewareData } = useFloating(buttonEl, panelEl, {
  middleware: [
    offset(10),
    props.placement
      ? flip({
          crossAxis: true,
          mainAxis: true,
          fallbackAxisSideDirection: "start",
        })
      : autoPlacement(),
    hide({
      strategy: "referenceHidden",
      padding: 16,
    }),
  ],
  whileElementsMounted: autoUpdate,
  placement: props.placement,
});
</script>
<template>
  <Menu v-slot="{ open }" as="div" class="relative">
    <MenuButton ref="buttonRef">
      <slot />
    </MenuButton>

    <Teleport to="body">
      <TransitionRoot :show="open">
        <MenuItems
          ref="panelRef"
          :style="floatingStyles"
          class="z-50 rounded-xl"
        >
          <TransitionChild
            leave="transition duration-75 ease-in-expo"
            leave-from="transform scale-100 opacity-100"
            leave-to="transform scale-95 opacity-0"
            as="template"
          >
            <div
              :class="{
                'origin-bottom-right':
                  middlewareData.offset?.placement === 'top-end',
                'origin-top-right':
                  middlewareData.offset?.placement === 'bottom-end',
                'origin-bottom': middlewareData.offset?.placement === 'top',
                'origin-top': middlewareData.offset?.placement === 'bottom',
                hidden: middlewareData.hide?.referenceHidden,
              }"
              class="local-anim min-w-56 select-none divide-y divide-label-separator overflow-y-auto whitespace-nowrap rounded-xl bg-background-3 text-sm shadow-lg ring-1 ring-label-separator focus-visible:outline-none"
            >
              <slot name="items" />
            </div>
          </TransitionChild>
        </MenuItems>
      </TransitionRoot>
    </Teleport>
  </Menu>
</template>

<style scoped>
.local-anim {
  animation: scaleIn 300ms cubic-bezier(0.1, 1, 0.22, 1);
}

@keyframes scaleIn {
  from {
    scale: 0.97;
  }
  to {
    scale: 1;
  }
}
</style>
