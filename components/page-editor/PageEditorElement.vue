<script setup lang="ts">
import type { DiscoverCollectionElement } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  element: DiscoverCollectionElement;
}>();

defineEmits(["add", "remove"]);

const elementTypes = computed(() => Object.values(PageEditorElementTypes));

const elementTypeName = (type: string) => {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
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
            label="Disabled"
            type="checkbox"
            v-model="element.disabled"
          />
          <PageEditorInput
            label="Feature preview only"
            type="checkbox"
            v-model="element.featurePreviewOnly"
          />
        </div>
        <PageEditorInput
          label="Platform"
          type="select"
          v-model="element.client"
          :options="['app', 'web', 'ios', 'android', null]"
        />
        <PageEditorInput
          label="Hide before"
          type="datetime-local"
          v-model="element.hideBefore"
        />
        <PageEditorInput
          label="Hide after"
          type="datetime-local"
          v-model="element.hideAfter"
        />
        <PageEditorInput label="Church ID" v-model="element.churchUid" />
        <PageEditorInput label="Experiment ID" v-model="element.experimentId" />
        <PageEditorInput label="Usergroup" v-model="element.userGroup" />
        <PageEditorInput
          label="Min age"
          type="number"
          v-model="element.minAge"
        />
        <PageEditorInput
          label="Max age"
          type="number"
          v-model="element.maxAge"
        />
        <PageEditorInput
          label="Min BMM version"
          v-model="element.minBmmVersion"
        />
        <PageEditorInput
          label="Max BMM version"
          v-model="element.maxBmmVersion"
        />
      </PageEditorFieldset>

      <!-- Type-specific fields -->
      <PageEditorFieldset title="Other">
        <template v-if="element.type === PageEditorElementTypes.Message">
          <PageEditorInput
            label="English Text"
            :element
            v-model="element.messageEn"
          />
          <PageEditorInput
            label="Norwegian Text"
            :element
            v-model="element.messageNb"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Header">
          <PageEditorInput label="Title" v-model="element.title" />
          <PageEditorInput
            label="Server Translation"
            v-model="element.serverTranslation"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.ProjectBox">
          <PageEditorInput label="Podcast ID" v-model="element.id" />
        </template>
        <template v-if="element.type === PageEditorElementTypes.PodcastTile">
          <PageEditorInput label="Podcast ID" v-model="element.id" />
          <PageEditorInput label="Color" type="color" v-model="element.color" />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Playlists">
          <PageEditorInput
            label="Number of Playlists"
            type="number"
            v-model="element.count"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Audiobooks">
          <PageEditorInput
            label="Number of Audiobooks"
            type="number"
            v-model="element.count"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Events">
          <PageEditorInput
            label="Number of Events"
            type="number"
            v-model="element.count"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Track">
          <PageEditorInput label="Track ID" v-model="element.id" />
        </template>
        <template
          v-if="element.type === PageEditorElementTypes.RecommendPrevious"
        >
          <PageEditorInput label="ID" v-model="element.id" :element />
        </template>
        <template v-if="element.type === PageEditorElementTypes.RecentMessages">
          <PageEditorInput
            label="Number of Messages"
            type="number"
            v-model="element.count"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.RecentSongs">
          <PageEditorInput
            label="Number of Songs"
            type="number"
            v-model="element.count"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Contributor">
          <PageEditorInput label="Contributor ID" v-model="element.id" />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Podcasts">
          <PageEditorInput
            label="Count"
            type="number"
            v-model="element.count"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Music">
          <PageEditorInput
            label="Count"
            type="number"
            v-model="element.count"
          />
        </template>
        <template
          v-if="element.type === PageEditorElementTypes.TrackCollection"
        >
          <PageEditorInput label="Track Collection ID" v-model="element.id" />
        </template>
        <template
          v-if="element.type === PageEditorElementTypes.FavoritePlaylists"
        >
          <PageEditorInput
            label="Count"
            type="number"
            v-model="element.count"
          />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Podcast">
          <PageEditorInput label="Podcast ID" v-model="element.id" />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Album">
          <PageEditorInput label="Album ID" v-model="element.id" />
        </template>
        <template v-if="element.type === PageEditorElementTypes.Playlist">
          <PageEditorInput label="Playlist ID" v-model="element.id" />
        </template>
        <template
          v-if="element.type === PageEditorElementTypes.TopTrackCollections"
        >
          <PageEditorInput
            label="Number of Collections"
            type="number"
            v-model="element.count"
          />
        </template>
        <template
          v-if="element.type === PageEditorElementTypes.UserLanguagePlaylists"
        >
          <PageEditorInput
            label="Number of Playlists"
            type="number"
            v-model="element.count"
          />
        </template>
        <template
          v-if="element.type === PageEditorElementTypes.PlaylistsForTag"
        >
          <PageEditorInput label="Tag" v-model="element.tag" />
        </template>
      </PageEditorFieldset>
    </div>
  </div>
</template>
