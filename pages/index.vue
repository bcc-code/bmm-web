<script lang="ts" setup>
import { LanguageEnum } from "@bcc-code/bmm-sdk-fetch";
import { IDiscoverableGroup } from "~/composables/discover";
import { MediaPlaylistInjectionKey } from "~/plugins/3.mediaPlayer";

const { setCurrentTrack } = inject(MediaPlaylistInjectionKey)!;

const { t, locale } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.home"));

const discoverGroups: Ref<IDiscoverableGroup[] | null> = ref(null);
const loading: Ref<boolean> = ref(true);

let stopHandles: (() => void)[] = [];
watch(
  locale,
  () => {
    const { data, pending } = useDiscover({
      // TODO: Find out how to set the age ...
      // Compatibility is ensured in i18n.config.ts file
      lang: locale.value as LanguageEnum,
    });
    stopHandles.forEach((el) => el());

    stopHandles = [
      watch(
        data,
        (d) => {
          discoverGroups.value = d;
        },
        { immediate: true }
      ),
      watch(
        pending,
        (p) => {
          loading.value = p;
        },
        { immediate: true }
      ),
    ];
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex flex-col gap-16">
    <ul>
      <template v-if="loading">
        <li
          v-for="index in 5"
          :key="index"
          class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2"
        ></li>
      </template>
      <template v-else>
        <li>
          <template
            v-for="group in discoverGroups"
            :key="group.header?.id || 0"
          >
            <PageHeading v-if="group.header" :level="3">
              <a
                v-if="typeof group.header.link === 'string'"
                :href="group.header.link"
              >
                {{ group.header.title }}
              </a>
              <span v-else>{{ group.header.title }}</span>
            </PageHeading>
            <div
              v-if="
                group.items.find(
                  (i: IDiscoverableGroup['items'][0]) => !['album', 'playlist', 'podcast'].includes(i.type)
                ) === undefined
              "
              class="flex space-x-8 overflow-x-auto scrollbar-hide"
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
                <div
                  v-else-if="item.type === 'podcast'"
                  style="position: relative"
                >
                  <ItemCard :item="item" />
                  <div
                    style="
                      position: absolute;
                      bottom: 0;
                      top: 0;
                      left: 0;
                      right: 0;
                      background-color: rgba(255, 0, 0, 0.4);
                      color: red;
                      display: flex;
                      justify-content: center;
                      align-content: center;
                      flex-direction: column;
                      text-align: center;
                    "
                  >
                    A page for podcasts is not yet implemented
                  </div>
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
                  @play-track="setCurrentTrack(item)"
                ></TrackItem>
                <li v-else>
                  <div
                    style="background-color: rgba(255, 0, 0, 0.4); color: red"
                  >
                    "{{ item.type }}" is not yet implemented ...
                  </div>
                </li>
              </template>
            </ol>
          </template>
        </li>
      </template>
    </ul>
  </div>
</template>
