<script lang="ts" setup>
import { IDiscoverable, LanguageEnum } from "@bcc-code/bmm-sdk-fetch";

const { t, locale } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.home"));

const discoveries: Ref<IDiscoverable[] | null> = ref(null);
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
          discoveries.value = d;
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
            v-for="item in discoveries"
            :key="`${item.type}_${item.id}`"
          >
            <PageHeading v-if="item.type === 'section_header'" :level="3"
              ><a v-if="typeof item.link === 'string'" :href="item.link"
                >{{ item.title }}
              </a>
              <span v-else>{{ item.title }}</span></PageHeading
            >
            <NuxtLink
              v-else-if="item.type === 'album'"
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
        </li>
      </template>
    </ul>
  </div>
</template>
