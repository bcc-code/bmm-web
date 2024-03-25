<script lang="ts" setup>
import { SearchApi, SearchFilter } from "@bcc-code/bmm-sdk-fetch";
import type {
  IAlbumContributorPodcastPlaylistOrTrack,
  SearchResults,
} from "@bcc-code/bmm-sdk-fetch";

const router = useRouter();
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => "");
const {
  query: { filter = "", term: termQuery },
  params: { term: termParam = "" },
} = useRoute<"search-term">();

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
const loading = ref(true);
const loadingMore = ref(false);
const fullyLoaded = ref(false);
const isMounted = ref<boolean>(false);
let searchFingerprint = null;

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
        fullyLoaded.value = data.isFullyLoaded === true;
      }
      loadingMore.value = false;
    }
  } catch (ex) {
    console.error("error", ex);
  }
}

onMounted(() => {
  isMounted.value = true;
  const main = ref<HTMLElement | null>(document.querySelector("main"));

  watchDebounced(
    [...reactiveDependencies(), searchTerm, searchFilter],
    async () => {
      results.value = null;
      list.value = [];
      if (searchTerm.value === "") {
        loading.value = false;
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
</script>

<template>
  <div>
    <Teleport v-if="isMounted" to="header .teleport">
      <div
        class="inline-block rounded-lg bg-background-2 focus-within:bg-background-1 mt-2 focus-within:shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
        :class="searchTerm === '' ? '' : 'bg-background-'"
      >
        <div class="flex w-80 items-center px-3 py-2">
          <NuxtIcon name="nav.search" class="text-label-1 text-xl" />
          <input
            v-model="searchTerm"
            type="text"
            :placeholder="t('search.input-placeholder')"
            class="w-auto flex-grow bg-background-2 focus-within:bg-background-1 px-2 outline-none text-label-1 text-[17px] placeholder:text-label-3"
          />
          <NuxtIcon
            v-if="searchTerm !== ''"
            name="icon.close.small"
            class="text-label-1 text-2xl cursor-pointer"
            @click="searchTerm = ''"
          ></NuxtIcon>
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
              'border-b-2 pb-[14px] border-label-1 text-label-1':
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
          <div class="text-2xl font-extrabold pt-6 pb-4">
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
            class="grid grid-cols-tracklist grid-rows-1 w-full divide-y divide-label-separator"
          >
            <template v-for="item in list" :key="item.id">
              <TrackItem
                v-if="item.type === 'track'"
                :track="item"
                :is-track-type-known="true"
                show-thumbnail
                @play-track="setQueue([item])"
              />
              <GenericListItem
                v-else-if="item.type === 'contributor'"
                :id="item.id"
                :route-name="'playlist-contributor-id'"
                :cover="item.cover"
                circle
                :label="item.name"
              />
              <GenericListItem
                v-else-if="item.type === 'album'"
                :id="item.id"
                :route-name="'album-id'"
                :cover="item.cover"
                :label="item.title"
              />
              <GenericListItem
                v-else-if="item.type === 'playlist'"
                :id="item.id"
                :route-name="'playlist-curated-id'"
                :cover="item.cover"
                :label="item.title"
              />
              <GenericListItem
                v-else-if="item.type === 'podcast'"
                :id="item.id"
                :route-name="'playlist-podcast-id'"
                :cover="item.cover"
                :label="item.title"
              />
              <li v-else>
                {{ ((a: never) => {})(item) }}
              </li>
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
