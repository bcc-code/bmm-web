<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus";

const { selectedPage, localStateForSelectedPage, save, loading } =
  usePageEditor();

const keyForElement = (element: PageEditorElement) => {
  return `${selectedPage.value}:${element.elementId}`;
};

const currentElement = useCurrentElement();
const scroller = ref<HTMLElement | null>();
onMounted(() => {
  scroller.value = currentElement.value.closest("main");
});
const { arrivedState } = useScroll(scroller);
const hasScrolled = computed(() => {
  return !arrivedState.top;
});

const removeElement = (elementId: string) => {
  localStateForSelectedPage.value = localStateForSelectedPage.value.filter(
    (element) => element.elementId !== elementId,
  );
};

const addElement = (index: number) => {
  const newElement: PageEditorElement = {
    elementId: generateUUID(),
  };
  localStateForSelectedPage.value.splice(index + 1, 0, newElement);
};
</script>

<template>
  <div>
    <header
      :class="[
        'sticky top-14 z-20 flex items-center justify-between gap-4 bg-background-1',
        { 'border-y border-label-separator': hasScrolled },
      ]"
    >
      <PageHeading
        :class="[
          'transition-all duration-200 ease-out',
          { ' !text-3xl': hasScrolled },
        ]"
      >
        Page Editor
      </PageHeading>
      <div class="flex items-center gap-4">
        <select
          id="page-selector"
          v-model="selectedPage"
          class="rounded-lg border border-label-separator bg-background-2 px-3 py-2"
        >
          <option value="discover">Homescreen</option>
          <option value="carplay">Carplay</option>
          <option value="playlists">Playlists</option>
        </select>
        <ButtonStyled
          intent="secondary"
          :size="hasScrolled ? 'small' : 'medium'"
          class="transition-all duration-200 ease-out"
          @click="reloadNuxtApp()"
        >
          Reset
        </ButtonStyled>
        <ButtonStyled
          intent="primary"
          :size="hasScrolled ? 'small' : 'medium'"
          class="transition-all duration-200 ease-out"
          :loading="loading.saving"
          @click="save"
        >
          Save changes
        </ButtonStyled>
      </div>
    </header>

    <NuxtIcon
      v-if="loading.page"
      name="icon.loading.animation"
      class="mx-auto text-4xl"
    />
    <VueDraggable
      v-if="!loading.page"
      v-model="localStateForSelectedPage"
      direction="vertical"
      handle=".drag-handle"
      ghost-class="opacity-50"
      class="relative z-0 flex flex-col gap-4"
    >
      <TransitionGroup
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        leave-active-class="transition duration-200 ease-out absolute"
        leave-to-class="opacity-0 scale-95"
        move-class="transition duration-200 ease-out"
      >
        <PageEditorElement
          v-for="(element, index) in localStateForSelectedPage"
          :key="keyForElement(element)"
          :element
          @add="addElement(index)"
          @remove="removeElement(element.elementId)"
        />
      </TransitionGroup>
    </VueDraggable>
  </div>
</template>
