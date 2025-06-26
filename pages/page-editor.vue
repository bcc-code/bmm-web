<script lang="ts">
export enum ElementTypes {
  Message = "message",
  Streak = "streak",
  PodcastTile = "podcast-tile",
  AudiobookTile = "audiobook-tile",
  MessageTile = "message-tile",
  ProjectBox = "project-box",
  RecommendTrackToUnlockAchievement = "recommend-track-to-unlock-achievement",
  Header = "header",
  Playlists = "playlists",
  FavoritePlaylists = "favorite-playlists",
  Audiobooks = "audiobooks",
  Events = "events",
  Track = "track",
  RecommendPrevious = "recommend-previous",
  RecentMessages = "recent-messages",
  RecentSongs = "recent-songs",
  Contributor = "contributor",
  Podcasts = "podcasts",
  Music = "music",
  TrackCollection = "track-collection",
}
</script>

<script setup lang="ts">
import { DiscoverApi } from "@bcc-code/bmm-sdk-fetch";
import type {
  DiscoverCollection,
  DiscoverCollectionElement,
} from "@bcc-code/bmm-sdk-fetch";
import hash from "stable-hash";
import { VueDraggable } from "vue-draggable-plus";

const elements = ref<DiscoverCollection>();

const selectedPage = ref<"discover" | "carplay" | "playlists">("discover");
const selectedClient = ref<"web" | "app">("app");

const filteredElements = computed(() => {
  if (!elements.value?.documents) {
    return [];
  }
  return elements.value.documents.filter((d) => {
    if (!d.client) return true;
    return d.client.toLowerCase() === selectedClient.value.toLowerCase();
  });
});

watch(
  selectedPage,
  async (page) => {
    if (page === "discover") {
      elements.value =
        await new DiscoverApi().discoverRawDiscoverCollectionGet();
    }
    if (page === "carplay") {
      elements.value = await new DiscoverApi().discoverRawCarplayHomeGet();
    }
    if (page === "playlists") {
      elements.value =
        await new DiscoverApi().discoverRawPlaylistDocumentsGet();
    }
  },
  {
    immediate: true,
  },
);

const getKeyForElement = (element: DiscoverCollectionElement) => {
  return hash(element);
};
</script>

<template>
  <div>
    <PageHeading>Page Editor</PageHeading>
    <div class="mb-8 flex gap-4">
      <select
        v-model="selectedPage"
        class="rounded-lg border border-label-separator bg-background-2 px-4 py-2"
      >
        <option value="discover">Discover</option>
        <option value="carplay">Carplay</option>
        <option value="playlists">Playlists</option>
      </select>
      <select
        v-if="selectedPage === 'discover'"
        v-model="selectedClient"
        class="rounded-lg border border-label-separator bg-background-2 px-4 py-2"
      >
        <option value="web">Web</option>
        <option value="app">App</option>
      </select>
    </div>

    <VueDraggable
      v-model="filteredElements"
      :animation="200"
      drag-class=".drag-handle"
      class="flex flex-col gap-4"
    >
      <template
        v-for="element in filteredElements"
        :key="getKeyForElement(element)"
      >
        <PageEditorElement
          v-if="element.type === ElementTypes.Streak"
          title="Streak"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.Message"
          title="Message"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.Header"
          title="Header"
          :element="element"
        >
          <p class="type-paragraph-1">{{ element.title }}</p>
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.ProjectBox"
          title="Project box"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.PodcastTile"
          title="Podcast tile"
          :element="element"
        >
          <div class="flex flex-col">
            <span>
              Color:
              <span
                class="rounded px-1 py-0.5 text-on-color-1"
                :style="{
                  backgroundColor: element.color ?? 'none',
                }"
              >
                {{ element.color }}
              </span>
            </span>
          </div>
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.AudiobookTile"
          title="Audiobook tile"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.MessageTile"
          title="Message tile"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.RecommendTrackToUnlockAchievement"
          title="Recommend track to unlock achievement"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.Playlists"
          title="Playlists"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.Audiobooks"
          title="Audiobooks"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.Events"
          title="Events"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.Track"
          title="Track"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.RecommendPrevious"
          title="Recommend previous"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.RecentMessages"
          title="Recent messages"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.RecentSongs"
          title="Recent songs"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.Contributor"
          title="Contributor"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.Podcasts"
          title="Podcasts"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.Music"
          title="Music"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.TrackCollection"
          title="Track collection"
          :element="element"
        >
        </PageEditorElement>
        <PageEditorElement
          v-if="element.type === ElementTypes.FavoritePlaylists"
          title="Favorite playlists"
          :element="element"
        >
        </PageEditorElement>
      </template>
    </VueDraggable>
  </div>
</template>
