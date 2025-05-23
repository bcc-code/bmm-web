<script lang="ts" setup>
import { SearchApi, SearchFilter } from "@bcc-code/bmm-sdk-fetch";
import type {
  Highlighting,
  IAlbumContributorPodcastPlaylistOrTrack,
  SearchResults,
  TrackModel,
} from "@bcc-code/bmm-sdk-fetch";

const router = useRouter();
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => "");
useHead({
  title: computed(() => t("nav.search")),
});
const {
  query: { filter = "", term: termQuery },
  params: { term: termParam = "" },
} = useRoute<"search-term">();

const searchbox = ref<HTMLInputElement | null>(null);
const searchFilter = ref<SearchFilter>(
  filter === "All" ||
    filter === "Speeches" ||
    filter === "Music" ||
    filter === "Albums" ||
    filter === "Contributors" ||
    filter === "Podcasts" ||
    filter === "Playlists"
    ? filter
    : "All",
);

const urlTerm = termQuery ?? termParam;
const searchTerm = ref<string>(typeof urlTerm === "string" ? urlTerm : "");

const api = new SearchApi();

const results = ref<SearchResults | null>(null);
const list = ref<IAlbumContributorPodcastPlaylistOrTrack[]>([]);
const highlightings = ref<Highlighting[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const fullyLoaded = ref(false);
const isMounted = ref<boolean>(false);
let searchFingerprint = null;

watch(searchbox, (box) => {
  if (box) {
    box.focus();
  }
});

async function loadSearchResults() {
  try {
    searchFingerprint = Math.random();
    const fingerprintAtLoad = searchFingerprint;
    const data = await api.searchV2TermGet({
      term: searchTerm.value,
      filter: searchFilter.value,
      from: results.value?.nextPageFromPosition || 0,
      size: 30,
    });
    if (searchFingerprint === fingerprintAtLoad) {
      loading.value = false;
      if (data && data.items) {
        results.value = data;
        list.value = list.value.concat(data.items);
        if (data.highlightings)
          highlightings.value = highlightings.value.concat(data.highlightings);
        fullyLoaded.value = data.isFullyLoaded === true;
      }
      loadingMore.value = false;
    }
  } catch (ex) {
    // TODO: Show an error message to the user
    console.error("error", ex);
  }
}

const main = ref<HTMLElement | null>();
onMounted(() => {
  isMounted.value = true;
  main.value = document.querySelector("main");

  watchDebounced(
    [...reactiveDependencies(), searchTerm, searchFilter],
    async () => {
      results.value = null;
      list.value = [];
      highlightings.value = [];
      if (searchTerm.value === "") {
        loading.value = false;
        const routeParams = {
          name: "search-term",
          query:
            searchFilter.value === "All" ? {} : { filter: searchFilter.value },
        };
        router.push(routeParams);
        return;
      }

      loading.value = true;

      const routeParams = {
        name: "search-term",
        query:
          searchFilter.value === "All"
            ? { term: searchTerm.value }
            : { term: searchTerm.value, filter: searchFilter.value },
      };

      router.push(routeParams);

      await loadSearchResults();
    },
    { immediate: true, debounce: 200, maxWait: 5000 },
  );

  useInfiniteScroll(
    main,
    async () => {
      if (
        loadingMore.value ||
        fullyLoaded.value ||
        loading.value ||
        !searchTerm.value
      ) {
        return;
      }

      loadingMore.value = true;
      await loadSearchResults();
    },
    { distance: 10, interval: 500, canLoadMore: () => !fullyLoaded.value },
  );
});

const tabs = [
  "All",
  "Speeches",
  "Music",
  "Albums",
  "Contributors",
  "Podcasts",
  "Playlists",
] as const;

const { setQueue } = useNuxtApp().$mediaPlayer;

function selectHighlighting(trackId: number) {
  const test = highlightings.value.find((x) => x.id === `track_${trackId}`);
  return test;
}

function playTrack(item: TrackModel) {
  const highlighting = selectHighlighting(item.id);
  const tracks: TrackModel[] = list.value.filter(
    (x): x is TrackModel => x.type === "track",
  );
  const index = tracks.findIndex((x: TrackModel) => x === item);
  if (highlighting && highlighting.startPositionInSeconds) {
    setQueue(tracks, index, "", highlighting.startPositionInSeconds);
  } else {
    setQueue(tracks, index);
  }
}
</script>

<template>
  <div>
    <Teleport v-if="isMounted" to="header .teleport">
      <div
        class="mt-2 inline-block rounded-lg bg-background-2 focus-within:bg-background-1 focus-within:shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
        :class="searchTerm === '' ? '' : 'bg-background-'"
      >
        <div class="flex w-80 items-center px-3 py-2">
          <NuxtIcon name="nav.search" class="text-xl text-label-1" />
          <input
            ref="searchbox"
            v-model="searchTerm"
            type="text"
            :placeholder="t('search.input-placeholder')"
            class="w-auto flex-grow bg-[transparent] px-2 text-[17px] text-label-1 outline-none placeholder:text-label-3"
          />
          <button
            v-if="searchTerm !== ''"
            class="cursor-pointer text-2xl text-label-1"
            @click="searchTerm = ''"
          >
            <NuxtIcon name="icon.close.small" />
          </button>
        </div>
      </div>

      <div class="flex">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="px-3"
          @click="searchFilter = tab"
        >
          <div
            class="py-[16px]"
            :class="{
              'border-b-2 border-label-1 pb-[14px] text-label-1':
                searchFilter === tab,
              'text-label-3': searchFilter !== tab,
            }"
          >
            {{ t("search.search-filter." + tab) }}
          </div>
        </button>
      </div>
    </Teleport>

    <div class="w-full">
      <div class="py-4">
        <div>
          <div class="pb-4 pt-6 text-2xl font-extrabold">
            <template v-if="loading">{{
              t("search.loading-results")
            }}</template>
            <template v-else-if="list.length === 0">
              <template v-if="results === null">{{
                t("search.no-results-yet")
              }}</template>
              <template v-else>{{ t("search.no-results-found") }}</template>
            </template>
            <template v-else>
              {{ t("search.result-count", results?.totalResults || 0) }}
            </template>
          </div>
          <ol
            class="grid w-full grid-cols-tracklist grid-rows-1 divide-y divide-label-separator"
          >
            <template v-for="item in list" :key="item.id">
              <TrackItem
                v-if="item.type === 'track'"
                :track="item"
                :is-track-type-known="true"
                show-thumbnail
                :highlight="selectHighlighting(item.id)"
                @play-track="playTrack(item)"
              />
              <GenericListItem
                v-else-if="item.type === 'contributor'"
                :route="{
                  name: 'playlist-contributor-id',
                  params: { id: item.id },
                }"
                :cover="item.cover"
                circle
                :label="item.name"
              />
              <GenericListItem
                v-else-if="item.type === 'album'"
                :route="{ name: 'album-id', params: { id: item.id } }"
                :cover="item.cover"
                :label="item.title"
              />
              <GenericListItem
                v-else-if="item.type === 'playlist'"
                :route="{
                  name: 'playlist-curated-id',
                  params: { id: item.id },
                }"
                :cover="item.cover"
                :label="item.title"
              />
              <GenericListItem
                v-else-if="item.type === 'podcast'"
                :route="{
                  name: 'playlist-podcast-id',
                  params: { id: item.id },
                }"
                :cover="item.cover"
                :label="item.title"
              />
              <li v-else>{{ item.type }} is not supported yet</li>
            </template>
            <ul v-if="loadingMore" class="col-span-full">
              <li
                v-for="index in 5"
                :key="index"
                class="my-6 h-11 animate-pulse rounded-lg bg-background-2"
              ></li>
            </ul>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
