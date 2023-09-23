<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.search"));

const activeTab = ref("All");

const tabs = [
  "All",
  "Speeches",
  "Music",
  "Events",
  "People",
  "Podcasts",
  "Playlists",
];
</script>

<template>
  <div>
    <div
      class="border-gray-300 flex w-60 items-center rounded bg-background-2 p-2"
    >
      <NuxtIcon name="nav.search" class="text-gray-500 ml-2 h-6 w-6" />
      <input
        type="text"
        placeholder="Search..."
        class="w-auto flex-grow bg-background-2 px-2 outline-none"
      />
    </div>
    <div class="w-full">
      <div class="flex space-x-6">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="py-2 text-label-3"
          :class="{
            'border-b-2 border-label-1 text-label-1': activeTab === tab,
          }"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>
      <div class="border-t border-label-4 p-4">
        <div v-show="activeTab === 'All'">All Content</div>
        <div v-show="activeTab === 'Speeches'">Speeches Content</div>
        <div v-show="activeTab === 'Music'">Music Content</div>
        <div v-show="activeTab === 'Events'">Events Content</div>
        <div v-show="activeTab === 'People'">People Content</div>
        <div v-show="activeTab === 'Podcasts'">Podcasts Content</div>
        <div v-show="activeTab === 'Playlists'">Playlists Content</div>
      </div>
    </div>
  </div>
</template>
