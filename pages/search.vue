<script lang="ts" setup>
import type { SearchResults, TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { watchDebounced } from "@vueuse/core";
import type { IDiscoverableGroup } from "composables/discover";

const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.search"));

const activeTab = ref("All");
const searchTerm = ref("");

const results = ref<SearchResults | null>(null);
const loading = ref(true);

let stopHandles: (() => void)[] = [];

watchDebounced(
  searchTerm,
  () => {
    const searchOptions = {
      term: searchTerm.value,
    };
    const { data, pending, stopHandler } = useSearch(searchOptions);
    stopHandles.forEach((el) => el());

    stopHandles = [
      stopHandler,
      watch(
        data,
        (d) => {
          results.value = d;
        },
        { immediate: true },
      ),
      watch(
        pending,
        (p) => {
          loading.value = p;
        },
        { immediate: true },
      ),
    ];
  },
  { immediate: true, debounce: 1000, maxWait: 5000 },
);

const tabs = [
  "All",
  "Speeches",
  "Music",
  "Events",
  "People",
  "Podcasts",
  "Playlists",
];

const { setQueue } = useNuxtApp().$mediaPlayer;
const playItem = (item: TrackModel, group: IDiscoverableGroup) => {
  const items = group.items.filter((c): c is TrackModel => c.type === "track");
  setQueue(
    items,
    items.findIndex((track) => track.id === item.id),
  );
};
</script>

<template>
  <div>
    <div
      class="border-gray-300 flex w-60 items-center rounded bg-background-2 p-2"
    >
      <NuxtIcon name="nav.search" class="text-gray-500 ml-2 h-6 w-6" />
      <input
        v-model="searchTerm"
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
        <div v-show="activeTab === 'All'">
          <ol class="w-full divide-y divide-label-separator">
            <template v-for="item in results?.items" :key="item.id">
              <TrackItem
                v-if="item.type === 'track'"
                :track="item"
                :is-track-type-known="true"
                show-thumbnail
                @play-track="playItem(item, { header: null, items: [item] })"
              ></TrackItem>
              <ContributorListItem
                v-else-if="item.type === 'contributor'"
                :contributor="item"
              ></ContributorListItem>
              <li v-else>
                <div style="background-color: rgba(255, 0, 0, 0.4); color: red">
                  "{{ item.type }}" is not yet implemented ...
                </div>
              </li>
            </template>
          </ol>
        </div>
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
