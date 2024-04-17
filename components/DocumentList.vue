<script setup lang="ts">
import type {
  IAllDocumentModels,
  TrackModel,
  SectionHeaderModel,
} from "@bcc-code/bmm-sdk-fetch";
import RecommendationItem from "./RecommendationItem.vue";

type IDiscoverableGroup = {
  header: SectionHeaderModel | null;
  items: IAllDocumentModels[];
  useFlex: boolean;
};

const { t } = useI18n();

const props = defineProps<{
  items: IAllDocumentModels[] | null | undefined;
  pending: boolean;
  useDailyPodcastView?: boolean | undefined;
}>();

const convertModels = (models: IAllDocumentModels[]) => {
  let currentSection: IDiscoverableGroup["items"] = [];
  const result: IDiscoverableGroup[] = [];
  const tiles: IDiscoverableGroup["items"] = [];
  let addedTiles: boolean = false;

  models.forEach((el, i) => {
    if (el.type === "Tile") {
      if (!el.lastPositionInMs) {
        // We currently don't support continuing from the position. Then it's better to hide it.

        tiles.push(el);
        if (!addedTiles) {
          result.push({ header: null, items: tiles, useFlex: true });
          addedTiles = true;
        }

        if (currentSection.length > 0) {
          currentSection = [];
          result.push({
            header: null,
            items: currentSection,
            useFlex: false,
          });
        }
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
const playSingleItem = (item: TrackModel) => {
  setQueue([item], 0); // ToDo: read item.lastPositionInMs and go to specific location
  // ToDo: load linked album (from showAllLink) and add remaining items to the queue
};
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
    <template v-else-if="props.items"
      ><template
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

        <div v-if="group.useFlex" class="mt-3 py-2">
          <div
            class="flex flex-row flex-wrap gap-6"
            :class="
              group.header &&
              group.header?.useCoverCarousel &&
              group.header?.link
                ? 'max-h-[27.5rem] overflow-hidden lg:max-h-[13rem]'
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

              <TileItem
                v-else-if="item.type === 'Tile' && item.track"
                :item="item"
                @play-track="playSingleItem(item.track)"
              ></TileItem>

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
          {{
            console.log(group.items)
          }}
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
