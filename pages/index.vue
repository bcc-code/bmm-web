<script lang="ts" setup>
import { LanguageEnum, DiscoverGetRequest } from "@bcc-code/bmm-sdk-fetch";
import { IDiscoverableGroup } from "~/composables/discover";
import { useAuth0 } from "@auth0/auth0-vue";

const { setCurrentTrack } = useNuxtApp().$mediaPlaylist;

const { t, locale } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.home"));

const discoverGroups: Ref<IDiscoverableGroup[] | null> = ref(null);
const loading: Ref<boolean> = ref(true);
const { user } = useAuth0();

function calculateAge(birthdate: string | undefined) {
  if (birthdate === undefined) return undefined;
  const date = new Date(birthdate);
  // We don't want the current age, just the age at the beginning of the year.
  return new Date().getFullYear() - date.getFullYear();
}

let stopHandles: (() => void)[] = [];
watch(
  locale,
  () => {
    const parameters: DiscoverGetRequest = {
      // Compatibility is ensured in i18n.config.ts file
      lang: locale.value as LanguageEnum,
    };
    // TODO: `user` can also be undefined. The type provided here is incorrect. https://github.com/auth0/auth0-vue/issues/237
    const age = calculateAge(user.value?.birthdate);
    if (age) parameters.age = age;
    const { data, pending, stopHandler } = useDiscover(parameters);
    stopHandles.forEach((el) => el());

    stopHandles = [
      stopHandler,
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
  <div>
    <template v-if="loading">
      <ul>
        <li
          v-for="index in 5"
          :key="index"
          class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2 dark:bg-background-dark-2"
        ></li>
      </ul>
    </template>
    <template v-else>
      <template v-for="group in discoverGroups" :key="group.header?.id || 0">
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
          v-if="group.header?.useCoverCarousel"
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
              @play-track="setCurrentTrack(item)"
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
