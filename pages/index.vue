<script lang="ts" setup>
import { LanguageEnum } from "@bcc-code/bmm-sdk-fetch";
import { IDiscoverableGroup } from "~/composables/discover";

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
            <PageHeading v-if="group.header" :level="3"
              ><a
                v-if="typeof group.header.link === 'string'"
                :href="group.header.link"
                >{{ group.header.title }}
              </a>
              <span v-else>{{ group.header.title }}</span></PageHeading
            >
            <template v-for="item in group.items" :key="item.id">
              <NuxtLink
                v-if="item.type === 'album'"
                :to="{ name: 'album-id', params: { id: item.id } }"
                class="inline-block pb-4 pr-4"
              >
                <ProtectedImage
                  :src="item.cover || ''"
                  class="aspect-square w-[214px] rounded-2xl"
                />
              </NuxtLink>
              <NuxtLink
                v-else-if="item.type === 'playlist'"
                :to="{ name: 'playlist-curated-id', params: { id: item.id } }"
                class="inline-block pb-4 pr-4"
              >
                <ProtectedImage
                  :src="item.cover || ''"
                  class="aspect-square w-[214px] rounded-2xl"
                />
              </NuxtLink>
              <TrackItem
                v-else-if="item.type === 'track'"
                :track="item"
              ></TrackItem>
              <p v-else>
                <span>"{{ item.type }}" is not yet implemented ...</span>
              </p>
            </template>
          </template>
        </li>
      </template>
    </ul>
  </div>
</template>
