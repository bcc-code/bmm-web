<script lang="ts" setup>
import { SearchFilter } from "@bcc-code/bmm-sdk-fetch";
import type { SearchResults } from "@bcc-code/bmm-sdk-fetch";

const router = useRouter();
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => "");
const {
  query: { filter = "" },
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

const searchTerm = ref(termParam);

const results = ref<SearchResults | null>(null);
const loading = ref(true);

let stopHandles: (() => void)[] = [];

const isMounted = ref<boolean>(false);
onMounted(() => (isMounted.value = true));
console.log("params", route.params, route.query);

watchDebounced(
  [searchTerm, searchFilter],
  () => {
    if (searchTerm.value === "") {
      loading.value = false;
      results.value = null;
      return;
    }

    const searchOptions = {
      term: searchTerm.value,
      filter: searchFilter.value,
    };
    const { data, pending, stopHandler } = useSearch(searchOptions);
    stopHandles.forEach((el) => el());

    stopHandles = [
      stopHandler,
      watch(
        data,
        (d) => {
          results.value = d;
          const routeParams = {
            name: "search-term",
            params: { term: searchTerm.value },
            query:
              searchFilter.value === "All"
                ? {}
                : { filter: searchFilter.value },
          };

          const { href } = router.resolve(routeParams);
          window.history.replaceState(null, "", href);
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
  { immediate: true, debounce: 200, maxWait: 5000 },
);

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
            placeholder="Search"
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
            <template
              v-else-if="!results?.items || results?.items?.length === 0"
            >
              <template v-if="results === null">{{
                t("search.no-results-yet")
              }}</template>
              <template v-else>{{ t("search.no-results-found") }}</template>
            </template>
            <template v-else>
              {{ t("search.result-count", results.items.length) }}
            </template>
          </div>
          <ol
            class="grid grid-cols-tracklist grid-rows-1 w-full divide-y divide-label-separator"
          >
            <template v-for="item in results?.items" :key="item.id">
              <TrackItem
                v-if="item.type === 'track'"
                :track="item"
                :is-track-type-known="true"
                show-thumbnail
                @play-track="setQueue([item])"
              ></TrackItem>
              <ContributorListItem
                v-else-if="item.type === 'contributor'"
                :contributor="item"
              ></ContributorListItem>
              <AlbumItem
                v-else-if="item.type === 'album'"
                :album="item"
              ></AlbumItem>
              <PlaylistItem
                v-else-if="item.type === 'playlist'"
                :playlist="item"
              ></PlaylistItem>
              <PodcastItem
                v-else-if="item.type === 'podcast'"
                :podcast="item"
              ></PodcastItem>
              <li v-else>
                {{ ((a: never) => {})(item) }}
              </li>
            </template>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
