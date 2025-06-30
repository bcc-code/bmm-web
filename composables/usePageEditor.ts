import type {
  DiscoverCollection,
  DiscoverCollectionElement,
} from "@bcc-code/bmm-sdk-fetch";
import { DiscoverApi } from "@bcc-code/bmm-sdk-fetch";

export type PageEditorElement = DiscoverCollectionElement & {
  elementId: string;
};

export enum PageEditorElementTypes {
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
  UnfinishedAudiobookTile = "unfinished-audiobook-tile",
  UnfinishedMessageTile = "unfinished-message-tile",
  YearInReview = "year-in-review",
  TileSorter = "tile-sorter",
  Album = "album",
  Podcast = "podcast",
  Playlist = "playlist",
  TopTrackCollections = "top-track-collections",
  UserLanguagePlaylists = "user-language-playlists",
  PlaylistsForTag = "playlists-for-tag",
}

export function usePageEditor() {
  const elements = ref<DiscoverCollection>();
  const selectedPage = ref<"discover" | "carplay" | "playlists">("discover");
  const localState = ref<PageEditorElement[]>([]);
  const localStateForSelectedPage = computed({
    get() {
      return localState.value || [];
    },
    set(v) {
      localState.value = v;
    },
  });

  watch(
    elements,
    (els) => {
      if (!els?.documents) {
        return;
      }
      localStateForSelectedPage.value = els.documents.map((e) => ({
        ...e,
        elementId: generateUUID(),
      }));
    },
    { immediate: true },
  );

  const loading = reactive({
    page: false,
    saving: false,
  });

  async function refresh() {
    loading.page = true;
    if (selectedPage.value === "discover") {
      elements.value =
        await new DiscoverApi().discoverRawDiscoverCollectionGet();
    }
    if (selectedPage.value === "carplay") {
      elements.value = await new DiscoverApi().discoverRawCarplayHomeGet();
    }
    if (selectedPage.value === "playlists") {
      elements.value =
        await new DiscoverApi().discoverRawPlaylistDocumentsGet();
    }
    loading.page = false;
  }

  watch(selectedPage, refresh, { immediate: true });

  async function save() {
    loading.saving = true;
    try {
      const params = {
        discoverCollection: {
          type: "discover_collection",
          documents: localStateForSelectedPage.value,
        },
      };
      if (selectedPage.value == "discover") {
        await new DiscoverApi().discoverRawDiscoverCollectionPost(params);
      }
      if (selectedPage.value == "carplay") {
        await new DiscoverApi().discoverRawCarplayHomePost(params);
      }
      if (selectedPage.value == "playlists") {
        await new DiscoverApi().discoverRawPlaylistDocumentsPost(params);
      }
    } catch (err) {
      console.error(err);
    } finally {
      loading.saving = false;
    }
  }

  return {
    elements,
    selectedPage,
    localStateForSelectedPage,
    save,
    loading,
    refresh,
  };
}
