<script lang="ts" setup>
import { LanguageEnum } from "@bcc-code/bmm-sdk-fetch";
import type { DiscoverGetRequest, TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import type { IDiscoverableGroup } from "~/composables/discover";

const { setQueue } = useNuxtApp().$mediaPlayer;
const userData = useNuxtApp().$userData;

const { t, locale } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.home"));

const discoverGroups = ref<IDiscoverableGroup[] | null>(null);
const loading = ref(true);

let stopHandles: (() => void)[] = [];
watch(
  locale,
  () => {
    const parameters: DiscoverGetRequest = {
      // Compatibility is ensured in i18n.config.ts file
      lang: locale.value as LanguageEnum,
    };
    if (userData.age) parameters.age = userData.age;
    const { data, pending, stopHandler } = useDiscover(parameters);
    stopHandles.forEach((el) => el());

    stopHandles = [
      stopHandler,
      watch(
        data,
        (d) => {
          discoverGroups.value = d;
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
  { immediate: true },
);

const playItem = (item: TrackModel, group: IDiscoverableGroup) => {
  const items = group.items.filter((c): c is TrackModel => c.type === "track");
  setQueue(
    items,
    items.findIndex((track) => track.id === item.id),
  );
};

const breakpoints = useBreakpoints(breakpointsTailwind);

const isSmallScreen = breakpoints.smallerOrEqual("lg");
</script>

<template>
  <div>
    <template v-if="loading">
      <ul>
        <li
          v-for="index in 5"
          :key="index"
          class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2"
        ></li>
      </ul>
    </template>
    <template v-else>
      <template v-for="group in discoverGroups" :key="group.header?.id || 0">
        <PageHeading v-if="group.header" :level="3">
          <div class="flex items-center justify-between">
            <div>
              <a
                v-if="typeof group.header.link === 'string'"
                :href="group.header.link"
              >
                {{ group.header.title }}
              </a>
              <span v-else>{{ group.header.title }}</span>
            </div>
            <a v-if="group.header.link" :href="group.header.link">
              <ButtonStyled intent="secondary" size="small">
                <span class="whitespace-nowrap">{{
                  t("home.list.see-all")
                }}</span></ButtonStyled
              >
            </a>
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
        <ol v-else class="w-full divide-y divide-label-separator">
          <template v-for="item in group.items" :key="item.id">
            <TrackItem
              v-if="item.type === 'track'"
              :track="item"
              :is-track-type-known="true"
              show-thumbnail
              @play-track="playItem(item, group)"
            ></TrackItem>
            <ContributorListItem
              v-else-if="item.type === 'contributor'"
              :contributor="item"
            ></ContributorListItem>
            <li v-else>
              <div style="background-color: rgba(255, 0, 0, 0.4); color: red">
                "{{ item.type }}" is not yet implemented ...
              </div>
            </li>
          </template>
        </ol>
      </template>
    </template>
  </div>
</template>
