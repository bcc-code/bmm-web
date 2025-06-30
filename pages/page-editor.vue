<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus";

const { selectedPage, localStateForSelectedPage, save, loading } =
  usePageEditor();

const keyForElement = (element: PageEditorElement) => {
  return `${selectedPage.value}:${element.elementId}`;
};
</script>

<template>
  <div>
    <header class="mb-8 flex items-center justify-between gap-4">
      <PageHeading>Page Editor</PageHeading>
      <div class="flex items-center gap-6">
        <select
          id="page-selector"
          v-model="selectedPage"
          class="rounded-lg border border-label-separator bg-background-2 px-3 py-2"
        >
          <option value="discover">Homescreen</option>
          <option value="carplay">Carplay</option>
          <option value="playlists">Playlists</option>
        </select>
        <ButtonStyled intent="primary" :loading="loading.saving" @click="save">
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
      :animation="200"
      direction="vertical"
      handle=".drag-handle"
      ghost-class="opacity-50"
      class="relative z-0 flex flex-col gap-4"
    >
      <template
        v-for="element in localStateForSelectedPage"
        :key="keyForElement(element)"
      >
        <PageEditorElement
          v-if="element.type === PageEditorElementTypes.Streak"
          title="Streak"
          :element
        />
        <PageEditorElement
          v-else-if="element.type == PageEditorElementTypes.Message"
          title="Message"
          :element
        >
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
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.Header"
          title="Header"
          :element
        >
          <PageEditorInput label="Title" v-model="element.title" />
          <PageEditorInput
            label="Server Translation"
            v-model="element.serverTranslation"
          />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.ProjectBox"
          title="Project Box"
          :element
        >
          <PageEditorInput label="Podcast ID" v-model="element.id" />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.PodcastTile"
          title="Podcast Tile"
          :element
        >
          <PageEditorInput label="Podcast ID" v-model="element.id" />
          <PageEditorInput label="Color" type="color" v-model="element.color" />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.AudiobookTile"
          title="Audiobook Tile"
          :element
        >
          {{ element }}
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.MessageTile"
          title="Message Tile"
          :element
        >
          {{ element }}
        </PageEditorElement>
        <PageEditorElement
          v-else-if="
            element.type ===
            PageEditorElementTypes.RecommendTrackToUnlockAchievement
          "
          title="Recommend Track to Unlock Achievement"
          :element
        >
          {{ element }}
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.Playlists"
          title="Playlists"
          :element
        >
          <PageEditorInput
            label="Number of Playlists"
            type="number"
            v-model="element.count"
          />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.Audiobooks"
          title="Audiobooks"
          :element
        >
          <PageEditorInput
            label="Number of Audiobooks"
            type="number"
            v-model="element.count"
          />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.Events"
          title="Events"
          :element
        >
          <PageEditorInput
            label="Number of Events"
            type="number"
            v-model="element.count"
          />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.Track"
          title="Track"
          :element
        >
          <PageEditorInput label="Track ID" v-model="element.id" />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.RecommendPrevious"
          title="Recommend Previous"
          :element
        >
          <PageEditorInput label="ID" v-model="element.id" :element />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.RecentMessages"
          title="Recent Messages"
          :element
        >
          <PageEditorInput
            label="Number of Messages"
            type="number"
            v-model="element.count"
          />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.RecentSongs"
          title="Recent Songs"
          :element
        >
          <PageEditorInput
            label="Number of Songs"
            type="number"
            v-model="element.count"
          />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.Contributor"
          title="Contributor"
          :element
        >
          <PageEditorInput label="Contributor ID" v-model="element.id" />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.Podcasts"
          title="Podcasts"
          :element
        >
          <PageEditorInput
            label="Count"
            type="number"
            v-model="element.count"
          />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.Music"
          title="Music"
          :element
        >
          <PageEditorInput
            label="Count"
            type="number"
            v-model="element.count"
          />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.TrackCollection"
          title="Track Collection"
          :element
        >
          <PageEditorInput label="Track Collection ID" v-model="element.id" />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.FavoritePlaylists"
          title="Favorite Playlists"
          :element
        >
          <PageEditorInput
            label="Count"
            type="number"
            v-model="element.count"
          />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="
            element.type === PageEditorElementTypes.UnfinishedAudiobookTile
          "
          title="Unfinished Audiobook Tile"
          :element
        >
        </PageEditorElement>
        <PageEditorElement
          v-else-if="
            element.type === PageEditorElementTypes.UnfinishedMessageTile
          "
          title="Unfinished Message Tile"
          :element
        />
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.Podcast"
          title="Podcast"
          :element
        >
          <PageEditorInput label="Podcast ID" v-model="element.id" />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.Album"
          title="Album"
          :element
        >
          <PageEditorInput label="Album ID" v-model="element.id" />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.Playlist"
          title="Playlist"
          :element
        >
          <PageEditorInput label="Playlist ID" v-model="element.id" />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.YearInReview"
          title="Year in Review"
          :element
        />
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.TileSorter"
          title="Tile Sorter"
          :element
        />
        <PageEditorElement
          v-else-if="
            element.type === PageEditorElementTypes.TopTrackCollections
          "
          title="Top Track Collections"
          :element
        >
          <PageEditorInput
            label="Number of Collections"
            type="number"
            v-model="element.count"
          />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="
            element.type === PageEditorElementTypes.UserLanguagePlaylists
          "
          title="User Language Playlists"
          :element
        >
          <PageEditorInput
            label="Number of Playlists"
            type="number"
            v-model="element.count"
          />
        </PageEditorElement>
        <PageEditorElement
          v-else-if="element.type === PageEditorElementTypes.PlaylistsForTag"
          title="Playlists for Tag"
          :element
        >
          <PageEditorInput label="Tag" v-model="element.tag" />
        </PageEditorElement>
        <PageEditorElement v-else :title="element.type ?? 'Unknown'" :element>
          {{ element }}
        </PageEditorElement>
      </template>
    </VueDraggable>
  </div>
</template>
