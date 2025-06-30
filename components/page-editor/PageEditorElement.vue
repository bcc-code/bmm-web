<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import type { DiscoverCollectionElement } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  element: DiscoverCollectionElement;
}>();

defineEmits(["add", "remove"]);

const elementTypes = computed(() => Object.values(PageEditorElementTypes));

const elementTypeName = (type: string) =>
  type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
</script>

<template>
  <div
    class="flex gap-4 rounded-xl border border-label-separator bg-background-2 px-4 py-2"
  >
    <NuxtIcon
      name="icon.sort"
      class="drag-handle cursor-ns-resize text-label-4"
    />
    <div class="grid w-full grid-cols-[auto_1fr] gap-y-2">
      <div class="col-span-full flex gap-4">
        <select
          v-model="element.type"
          class="type-subtitle-2 rounded-md bg-background-1 px-2 py-1 text-label-3"
        >
          <option v-for="type in elementTypes" :key="type" :value="type">
            {{ elementTypeName(type) }}
          </option>
        </select>
        <button
          class="type-subtitle-2 ml-auto flex items-center gap-1 text-label-4"
          @click="$emit('add')"
        >
          <NuxtIcon name="icon.add" />
          Add after
        </button>
        <button
          class="type-subtitle-2 flex items-center gap-1 text-label-4"
          @click="$emit('remove')"
        >
          <NuxtIcon name="icon.close.small" />
          Delete
        </button>
      </div>

      <!-- Standard fields -->
      <PageEditorFieldset title="Standard">
        <div class="flex w-full gap-x-4">
          <PageEditorInput
            v-model="element.disabled"
            label="Disabled"
            type="checkbox"
          />
          <PageEditorInput
            v-model="element.featurePreviewOnly"
            label="Feature preview only"
            type="checkbox"
          />
        </div>
        <PageEditorInput
          v-model="element.client"
          label="Platform"
          type="select"
          :options="['app', 'web', 'ios', 'android', null]"
        />
        <PageEditorInput
          v-model="element.hideBefore"
          label="Hide before"
          type="datetime-local"
        />
        <PageEditorInput
          v-model="element.hideAfter"
          label="Hide after"
          type="datetime-local"
        />
        <PageEditorInput v-model="element.churchUid" label="Church ID" />
        <PageEditorInput v-model="element.experimentId" label="Experiment ID" />
        <PageEditorInput v-model="element.userGroup" label="Usergroup" />
        <PageEditorInput
          v-model="element.minAge"
          label="Min age"
          type="number"
        />
        <PageEditorInput
          v-model="element.maxAge"
          label="Max age"
          type="number"
        />
        <PageEditorInput
          v-model="element.minBmmVersion"
          label="Min BMM version"
        />
        <PageEditorInput
          v-model="element.maxBmmVersion"
          label="Max BMM version"
        />
      </PageEditorFieldset>

      <!-- Type-specific fields -->
      <PageEditorFieldset title="Other">
        <template v-if="element.type === PageEditorElementTypes.Message">
          <PageEditorInput
            v-model="element.messageEn"
            label="English Text"
            :element
          />
          <PageEditorInput
            v-model="element.messageNb"
            label="Norwegian Text"
            :element
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Header">
          <PageEditorInput v-model="element.title" label="Title" />
          <PageEditorInput
            v-model="element.serverTranslation"
            label="Server Translation"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.ProjectBox">
          <PageEditorInput v-model="element.id" label="Podcast ID" />
        </template>
        <template v-if="element.type === PageEditorElementTypes.PodcastTile">
          <PageEditorInput v-model="element.id" label="Podcast ID" />
          <PageEditorInput v-model="element.color" label="Color" type="color" />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Playlists">
          <PageEditorInput
            v-model="element.count"
            label="Number of Playlists"
            type="number"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Audiobooks">
          <PageEditorInput
            v-model="element.count"
            label="Number of Audiobooks"
            type="number"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Events">
          <PageEditorInput
            v-model="element.count"
            label="Number of Events"
            type="number"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Track">
          <PageEditorInput v-model="element.id" label="Track ID" />
        </template>
        <template
          v-if="element.type === PageEditorElementTypes.RecommendPrevious"
        >
          <PageEditorInput v-model="element.id" label="ID" :element />
        </template>
        <template v-if="element.type === PageEditorElementTypes.RecentMessages">
          <PageEditorInput
            v-model="element.count"
            label="Number of Messages"
            type="number"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.RecentSongs">
          <PageEditorInput
            v-model="element.count"
            label="Number of Songs"
            type="number"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Contributor">
          <PageEditorInput v-model="element.id" label="Contributor ID" />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Podcasts">
          <PageEditorInput
            v-model="element.count"
            label="Count"
            type="number"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Music">
          <PageEditorInput
            v-model="element.count"
            label="Count"
            type="number"
          />
        </template>
        <template
          v-if="element.type === PageEditorElementTypes.TrackCollection"
        >
          <PageEditorInput v-model="element.id" label="Track Collection ID" />
        </template>
        <template
          v-if="element.type === PageEditorElementTypes.FavoritePlaylists"
        >
          <PageEditorInput
            v-model="element.count"
            label="Count"
            type="number"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Podcast">
          <PageEditorInput v-model="element.id" label="Podcast ID" />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Album">
          <PageEditorInput v-model="element.id" label="Album ID" />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Playlist">
          <PageEditorInput v-model="element.id" label="Playlist ID" />
        </template>
        <template
          v-if="element.type === PageEditorElementTypes.TopTrackCollections"
        >
          <PageEditorInput
            v-model="element.count"
            label="Number of Collections"
            type="number"
          />
        </template>
        <template
          v-if="element.type === PageEditorElementTypes.UserLanguagePlaylists"
        >
          <PageEditorInput
            v-model="element.count"
            label="Number of Playlists"
            type="number"
          />
        </template>
        <template
          v-if="element.type === PageEditorElementTypes.PlaylistsForTag"
        >
          <PageEditorInput v-model="element.tag" label="Tag" />
        </template>
      </PageEditorFieldset>
    </div>
  </div>
</template>
