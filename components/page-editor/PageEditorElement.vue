<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import type { DiscoverCollectionElement } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  element: DiscoverCollectionElement;
  collapse?: boolean;
}>();

defineEmits(["add", "remove"]);

const elementTypes = computed(() => Object.values(PageEditorElementTypes));

const elementTypeName = (type: string) =>
  type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const showUnusedFields = ref(false);

const shouldShowField = (value: unknown) =>
  showUnusedFields.value || (value !== undefined && value !== null);
</script>

<template>
  <div
    class="flex gap-4 rounded-xl border border-label-separator bg-background-2 px-4 py-2"
  >
    <NuxtIcon
      name="icon.sort"
      class="drag-handle h-max cursor-ns-resize py-[5px] text-label-4"
    />
    <div class="grid w-full grid-cols-[auto_1fr] gap-y-2">
      <div class="col-span-full flex items-center gap-4">
        <select
          v-model="element.type"
          class="type-subtitle-2 rounded-md bg-background-1 px-2 py-1 text-label-3"
        >
          <option v-for="type in elementTypes" :key="type" :value="type">
            {{ elementTypeName(type) }}
          </option>
        </select>
        <PageEditorInput
          v-model="element.disabled"
          label="Disabled"
          type="checkbox"
        />
        <button
          class="type-subtitle-2 ml-auto flex items-center gap-1 text-label-4"
          @click="showUnusedFields = !showUnusedFields"
        >
          <NuxtIcon
            name="icon.chevron.down"
            :class="{ 'rotate-180': showUnusedFields }"
          />
          {{ showUnusedFields ? "Hide" : "Show" }} unused fields
        </button>
        <button
          class="type-subtitle-2 flex items-center gap-1 text-label-4"
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

      <template v-if="!collapse">
        <!-- Standard fields -->
        <PageEditorFieldset title="Standard">
          <div
            v-if="shouldShowField(element.featurePreviewOnly)"
            class="w-full"
          >
            <PageEditorInput
              v-model="element.featurePreviewOnly"
              label="Feature preview only"
              type="checkbox"
            />
          </div>
          <PageEditorInput
            v-if="shouldShowField(element.client)"
            v-model="element.client"
            label="Platform"
            type="select"
            :options="['app', 'web', 'ios', 'android', null]"
          />
          <PageEditorInput
            v-if="shouldShowField(element.hideBefore)"
            v-model="element.hideBefore"
            label="Hide before"
            type="datetime-local"
          />
          <PageEditorInput
            v-if="shouldShowField(element.hideAfter)"
            v-model="element.hideAfter"
            label="Hide after"
            type="datetime-local"
          />
          <PageEditorInput
            v-if="shouldShowField(element.churchUid)"
            v-model="element.churchUid"
            label="Church ID"
          />
          <PageEditorInput
            v-if="shouldShowField(element.experimentId)"
            v-model="element.experimentId"
            label="Experiment ID"
          />
          <PageEditorInput
            v-if="shouldShowField(element.userGroup)"
            v-model="element.userGroup"
            label="Usergroup"
          />
          <PageEditorInput
            v-if="shouldShowField(element.minAge)"
            v-model="element.minAge"
            label="Min age"
            type="number"
          />
          <PageEditorInput
            v-if="shouldShowField(element.maxAge)"
            v-model="element.maxAge"
            label="Max age"
            type="number"
          />
          <PageEditorInput
            v-if="shouldShowField(element.minBmmVersion)"
            v-model="element.minBmmVersion"
            label="Min BMM version"
          />
          <PageEditorInput
            v-if="shouldShowField(element.maxBmmVersion)"
            v-model="element.maxBmmVersion"
            label="Max BMM version"
          />
        </PageEditorFieldset>
        <!-- Type-specific fields -->
        <PageEditorFieldset title="Other">
          <template v-if="element.type === PageEditorElementTypes.Message">
            <div class="flex w-full flex-col gap-3">
              <PageEditorInput
                v-if="shouldShowField(element.messageNb)"
                v-model="element.messageNb"
                label="Norwegian Text"
                :element
              />
              <PageEditorInput
                v-if="shouldShowField(element.messageEn)"
                v-model="element.messageEn"
                label="English Text"
                :element
              />
            </div>
          </template>
          <template v-if="element.type === PageEditorElementTypes.Header">
            <PageEditorInput
              v-if="shouldShowField(element.title)"
              v-model="element.title"
              label="Title"
            />
            <PageEditorInput
              v-if="shouldShowField(element.serverTranslation)"
              v-model="element.serverTranslation"
              label="Server Translation"
            />
          </template>
          <template v-if="element.type === PageEditorElementTypes.ProjectBox">
            <PageEditorInput
              v-if="shouldShowField(element.id)"
              v-model="element.id"
              label="Podcast ID"
            />
          </template>
          <template v-if="element.type === PageEditorElementTypes.PodcastTile">
            <PageEditorInput
              v-if="shouldShowField(element.id)"
              v-model="element.id"
              label="Podcast ID"
            />
            <PageEditorInput
              v-if="shouldShowField(element.color)"
              v-model="element.color"
              label="Color"
              type="color"
            />
          </template>
          <template v-if="element.type === PageEditorElementTypes.Playlists">
            <PageEditorInput
              v-if="shouldShowField(element.count)"
              v-model="element.count"
              label="Number of Playlists"
              type="number"
            />
          </template>
          <template v-if="element.type === PageEditorElementTypes.Audiobooks">
            <PageEditorInput
              v-if="shouldShowField(element.count)"
              v-model="element.count"
              label="Number of Audiobooks"
              type="number"
            />
          </template>
          <template v-if="element.type === PageEditorElementTypes.Events">
            <PageEditorInput
              v-if="shouldShowField(element.count)"
              v-model="element.count"
              label="Number of Events"
              type="number"
            />
          </template>
          <template v-if="element.type === PageEditorElementTypes.Track">
            <PageEditorInput
              v-if="shouldShowField(element.id)"
              v-model="element.id"
              label="Track ID"
            />
          </template>
          <template
            v-if="element.type === PageEditorElementTypes.RecommendPrevious"
          >
            <PageEditorInput
              v-if="shouldShowField(element.id)"
              v-model="element.id"
              label="ID"
              :element
            />
          </template>
          <template
            v-if="element.type === PageEditorElementTypes.RecentMessages"
          >
            <PageEditorInput
              v-if="shouldShowField(element.count)"
              v-model="element.count"
              label="Number of Messages"
              type="number"
            />
          </template>
          <template v-if="element.type === PageEditorElementTypes.RecentSongs">
            <PageEditorInput
              v-if="shouldShowField(element.count)"
              v-model="element.count"
              label="Number of Songs"
              type="number"
            />
          </template>
          <template v-if="element.type === PageEditorElementTypes.Contributor">
            <PageEditorInput
              v-if="shouldShowField(element.id)"
              v-model="element.id"
              label="Contributor ID"
            />
          </template>
          <template v-if="element.type === PageEditorElementTypes.Podcasts">
            <PageEditorInput
              v-if="shouldShowField(element.count)"
              v-model="element.count"
              label="Count"
              type="number"
            />
          </template>
          <template v-if="element.type === PageEditorElementTypes.Music">
            <PageEditorInput
              v-if="shouldShowField(element.count)"
              v-model="element.count"
              label="Count"
              type="number"
            />
          </template>
          <template
            v-if="element.type === PageEditorElementTypes.TrackCollection"
          >
            <PageEditorInput
              v-if="shouldShowField(element.id)"
              v-model="element.id"
              label="Track Collection ID"
            />
          </template>
          <template
            v-if="element.type === PageEditorElementTypes.FavoritePlaylists"
          >
            <PageEditorInput
              v-if="shouldShowField(element.count)"
              v-model="element.count"
              label="Count"
              type="number"
            />
          </template>
          <template v-if="element.type === PageEditorElementTypes.Podcast">
            <PageEditorInput
              v-if="shouldShowField(element.id)"
              v-model="element.id"
              label="Podcast ID"
            />
          </template>
          <template v-if="element.type === PageEditorElementTypes.Album">
            <PageEditorInput
              v-if="shouldShowField(element.id)"
              v-model="element.id"
              label="Album ID"
            />
          </template>
          <template v-if="element.type === PageEditorElementTypes.Playlist">
            <PageEditorInput
              v-if="shouldShowField(element.id)"
              v-model="element.id"
              label="Playlist ID"
            />
          </template>
          <template
            v-if="element.type === PageEditorElementTypes.TopTrackCollections"
          >
            <PageEditorInput
              v-if="shouldShowField(element.count)"
              v-model="element.count"
              label="Number of Collections"
              type="number"
            />
          </template>
          <template
            v-if="element.type === PageEditorElementTypes.UserLanguagePlaylists"
          >
            <PageEditorInput
              v-if="shouldShowField(element.count)"
              v-model="element.count"
              label="Number of Playlists"
              type="number"
            />
          </template>
          <template
            v-if="element.type === PageEditorElementTypes.PlaylistsForTag"
          >
            <PageEditorInput
              v-if="shouldShowField(element.tag)"
              v-model="element.tag"
              label="Tag"
            />
          </template>
        </PageEditorFieldset>
      </template>
    </div>
  </div>
</template>
