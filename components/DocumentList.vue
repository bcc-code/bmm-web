<script setup lang="ts">
import type {
  IAllDocumentModels,
  TrackModel,
  SectionHeaderModel,
} from "@bcc-code/bmm-sdk-fetch";
import { UAParser } from "ua-parser-js";
import RecommendationItem from "./RecommendationItem.vue";

type IDiscoverableGroup = {
  header: SectionHeaderModel | null;
  items: IAllDocumentModels[];
  useFlex: boolean;
  isTileContainer: boolean;
};

const { t } = useI18n();

const props = defineProps<{
  items: IAllDocumentModels[] | null | undefined;
  pending: boolean;
  useDailyPodcastView?: boolean | undefined;
  showMessageToMobileUsers?: boolean | undefined;
}>();

const convertModels = (models: IAllDocumentModels[]) => {
  let currentSection: IDiscoverableGroup["items"] = [];
  const result: IDiscoverableGroup[] = [];
  const tiles: IDiscoverableGroup["items"] = [];
  let addedTiles: boolean = false;

  models.forEach((el, i) => {
    if (el.type === "Tile") {
      tiles.push(el);
      if (!addedTiles) {
        result.push({
          header: null,
          items: tiles,
          useFlex: false,
          isTileContainer: true,
        });
        addedTiles = true;
      }

      if (currentSection.length > 0) {
        currentSection = [];
        result.push({
          header: null,
          items: currentSection,
          useFlex: false,
          isTileContainer: false,
        });
      }
    } else if (el.type === "project_box") {
      console.log(
        `since we don't have a design for ${el.type} we don't render it.`,
      );
    } else if (el.type === "section_header" && !props.useDailyPodcastView) {
      currentSection = [];
      result.push({
        header: el,
        items: currentSection,
        useFlex: el.useCoverCarousel === true,
        isTileContainer: false,
      });
    } else if (
      i === 0 ||
      el.type === "recommendation" ||
      el.type === "InfoMessage" ||
      el.type === "listening_streak"
    ) {
      currentSection = [el];
      result.push({
        header: null,
        items: currentSection,
        useFlex: false,
        isTileContainer: false,
      });
    } else {
      currentSection.push(el);
    }
  });
  return result;
};

const { setQueue } = useNuxtApp().$mediaPlayer;

const playItem = (item: TrackModel, group: IDiscoverableGroup) => {
  const items = group.items.filter((c): c is TrackModel => c.type === "track");
  setQueue(
    items,
    items.findIndex((track) => track.id === item.id),
  );
};
const { device } = UAParser(navigator.userAgent);
const mobileLink =
  device.vendor === "Apple"
    ? "https://apps.apple.com/app/bmm-brunstad/id777577855"
    : "https://play.google.com/store/apps/details?id=org.brunstad.bmm";
</script>

<template>
  <div>
    <template v-if="props.pending">
      <ul>
        <li
          v-for="index in 5"
          :key="index"
          class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2"
        ></li>
      </ul>
    </template>
    <template v-else-if="props.items">
      <NuxtLink
        v-if="props.showMessageToMobileUsers && device.type === 'mobile'"
        class="col-span-full flex gap-3 rounded-2xl bg-background-2 p-4 font-medium md:hidden"
        :to="mobileLink"
        target="_blank"
      >
        <div>
          <NuxtIcon name="icon.alert" class="text-2xl" />
        </div>
        {{ t("download.install-app") }}
        {{ t("download.go-to-store") }}
      </NuxtLink>
      <template
        v-for="group in convertModels(props.items)"
        :key="group.header?.id || 0"
      >
        <h2
          v-if="group.header"
          class="mb-5 mt-12 text-[28px] font-extrabold leading-tight text-label-1"
        >
          <div class="flex items-center justify-between">
            <div>
              <NuxtLink
                v-if="typeof group.header.link === 'string'"
                :to="parseLink(group.header.link)"
              >
                {{ group.header.title }}
              </NuxtLink>
              <span v-else>{{ group.header.title }}</span>
            </div>
            <NuxtLink
              v-if="group.header.link"
              :to="parseLink(group.header.link)"
            >
              <ButtonStyled intent="secondary" size="small">
                <span class="whitespace-nowrap">
                  {{ t("home.list.see-all") }}
                </span>
              </ButtonStyled>
            </NuxtLink>
          </div>
        </h2>

        <div
          v-if="group.isTileContainer"
          class="mt-3 grid w-full grid-cols-tilesOneLine gap-4 sm:grid-cols-tilesNarrow md:gap-6 lg:grid-cols-tilesWide"
        >
          <template v-for="item in group.items" :key="item.id">
            <TileItem
              v-if="item.type === 'Tile' && item.track"
              :item="item"
            ></TileItem>
          </template>
        </div>

        <div v-else-if="group.useFlex" class="mt-3 py-2">
          <div
            class="flex flex-row flex-wrap gap-6"
            :class="
              group.header &&
              group.header?.useCoverCarousel &&
              group.header?.link
                ? 'max-h-[21.5rem] overflow-hidden sm:max-h-[27.5rem] lg:max-h-[13rem]'
                : ''
            "
          >
            <template v-for="item in group.items" :key="item.id">
              <NuxtLink
                v-if="item.type === 'album'"
                :to="{ name: 'album-id', params: { id: item.id } }"
              >
                <ItemCard :item="item" />
              </NuxtLink>
              <NuxtLink
                v-else-if="item.type === 'playlist'"
                :to="{ name: 'playlist-curated-id', params: { id: item.id } }"
              >
                <ItemCard :item="item" />
              </NuxtLink>
              <NuxtLink
                v-else-if="item.type === 'podcast'"
                :to="{ name: 'playlist-podcast-id', params: { id: item.id } }"
              >
                <ItemCard :item="item" />
              </NuxtLink>

              <div
                v-else
                class="grid w-52 flex-shrink-0 basis-52 gap-4"
                style="background-color: rgba(255, 0, 0, 0.4); color: red"
              >
                "{{ item.type }}" is not yet implemented ...
              </div>
            </template>
          </div>
        </div>
        <ol
          v-else
          class="mt-3 grid w-full grid-cols-tracklist divide-y divide-label-separator lg:mt-4"
        >
          <template v-for="item in group.items" :key="item.id">
            <h2
              v-if="item.type === 'chapter_header'"
              class="pb-4 pt-10 text-[28px] font-extrabold leading-tight"
            >
              {{ item.title }}
            </h2>
            <h2
              v-else-if="item.type === 'section_header'"
              class="type-heading-2 col-span-full pb-5 pt-12 text-label-1"
            >
              <div class="flex items-center justify-between">
                <div>
                  {{ item.title }}
                </div>
                <NuxtLink v-if="item.link" :to="parseLink(item.link)">
                  <ButtonStyled intent="secondary" size="small">
                    <span class="whitespace-nowrap">
                      {{ t("home.list.see-all") }}
                    </span>
                  </ButtonStyled>
                </NuxtLink>
              </div>
            </h2>
            <TrackItem
              v-else-if="item.type === 'track'"
              :track="item"
              :is-track-type-known="true"
              :use-daily-podcast-view="useDailyPodcastView"
              show-thumbnail
              @play-track="playItem(item, group)"
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
              :route="{ name: 'playlist-curated-id', params: { id: item.id } }"
              :cover="item.cover"
              :label="item.title"
            />
            <GenericListItem
              v-else-if="item.type === 'podcast'"
              :route="{ name: 'playlist-podcast-id', params: { id: item.id } }"
              :cover="item.cover"
              :label="item.title"
            />
            <StreakItem
              v-else-if="item.type === 'listening_streak'"
              :item="item"
            />
            <RecommendationItem
              v-else-if="item.type === 'recommendation'"
              :item="item"
            />
            <div
              v-else-if="item.type === 'InfoMessage'"
              class="col-span-full flex gap-3 rounded-2xl bg-background-2 p-4 font-medium"
            >
              <div>
                <NuxtIcon name="icon.alert" class="text-2xl" />
              </div>
              {{ item.translatedMessage }}
            </div>

            <li v-else class="col-span-full">
              <div style="background-color: rgba(255, 0, 0, 0.4); color: red">
                "{{ item.type }}" is not yet implemented ...
              </div>
            </li>
          </template>
        </ol>
      </template>
    </template>
    <template v-else>
      <div style="background-color: rgba(255, 0, 0, 0.4); color: red">
        This list is empty 😔
      </div>
    </template>
  </div>
</template>
