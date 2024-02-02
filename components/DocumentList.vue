<script setup lang="ts">
import type {
  IAllDocumentModels,
  TrackModel,
  SectionHeaderModel,
} from "@bcc-code/bmm-sdk-fetch";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

type IDiscoverableGroup = {
  header: SectionHeaderModel | null;
  items: Exclude<IAllDocumentModels, SectionHeaderModel>[];
};

const { t } = useI18n();

const props = defineProps<{
  items: IAllDocumentModels[] | null | undefined;
  pending: boolean;
}>();

const convertModels = (models: IAllDocumentModels[]) => {
  let currentSection: IDiscoverableGroup["items"] = [];
  const result: IDiscoverableGroup[] = [];
  models.forEach((el, i) => {
    if (el.type === "section_header") {
      currentSection = [];
      result.push({
        header: el,
        items: currentSection,
      });
    } else if (i === 0) {
      currentSection = [el];
      result.push({
        header: null,
        items: currentSection,
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

// We remove the hostname so that we use SPA links (without full page refresh)
const parseLink = (link: string) => {
  const url = new URL(link);
  return url.pathname + url.search + url.hash;
};

const breakpoints = useBreakpoints(breakpointsTailwind);
const isSmallScreen = breakpoints.smallerOrEqual("lg");
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
        <PageHeading v-if="group.header" :level="3">
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
        </PageHeading>
        <div
          v-if="group.header?.useCoverCarousel"
          class="flex flex-row flex-wrap gap-6"
        >
          <template
            v-for="item in group.items.slice(0, isSmallScreen ? 4 : 6)"
            :key="item.id"
          >
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
        <ol
          v-else
          class="w-full divide-y divide-label-separator grid grid-cols-tracklist"
        >
          <template v-for="item in group.items" :key="item.id">
            <h2
              v-if="item.type === 'chapter_header'"
              class="text-2xl font-extrabold pt-10 pb-4"
            >
              {{ item.title }}
            </h2>
            <TrackItem
              v-else-if="item.type === 'track'"
              :track="item"
              :is-track-type-known="true"
              show-thumbnail
              @play-track="playItem(item, group)"
            ></TrackItem>
            <ContributorListItem
              v-else-if="item.type === 'contributor'"
              :contributor="item"
            ></ContributorListItem>
            <AlbumItem v-else-if="item.type === 'album'" :album="item" />
            <PlaylistItem
              v-else-if="item.type === 'playlist'"
              :playlist="item"
            />
            <PodcastItem v-else-if="item.type === 'podcast'" :podcast="item" />
            <li v-else>
              <div style="background-color: rgba(255, 0, 0, 0.4); color: red">
                "{{ item.type }}" is not yet implemented ...
                {{ console.log("not implemented", item) }}
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
