<script lang="ts" setup>
import { version } from "~/package.json";
import { isTranscriptionManager } from "~/utils/roles";
import type { NuxtIconName } from "#build/nuxt-icons";
import type { RoutesNamedLocations } from "@typed-router";

const { data: collections } = usePrivatePlaylists();
const runtimeConfig = useRuntimeConfig();
const isElectron = runtimeConfig.public.systemName === "Electron";
const isElectronOnMac = isElectron && runtimeConfig.public.isMac;
const isMounted = ref<boolean>(false);
onMounted(() => {
  isMounted.value = true;
});
const hamburgerOpen = ref<boolean>(false);

const { data: currentUser } = await useCurrentUser();

const { t } = useI18n();

type Tool = {
  id: string;
  name: string;
  icon: NuxtIconName;
  link: RoutesNamedLocations;
  show: boolean;
};
const tools = computed<Tool[]>(() => {
  const items = [
    {
      id: "dashboard",
      name: t("dashboards.title"),
      icon: "icon.dashboard",
      link: { name: "dashboards-fra-kaare" },
      show: isFraKaareDashboardViewer(currentUser.value),
    },
    {
      id: "transcriptions",
      name: t("nav.transcribe"),
      icon: "icon.transcription",
      link: { name: "transcribe" },
      show: isTranscriptionManager(currentUser.value),
    },
    {
      id: "lyrics",
      name: t("nav.lyrics"),
      icon: "icon.lyrics",
      link: { name: "lyrics" },
      show: isLyricsManager(currentUser.value),
    },
  ].filter((t) => t.show) as Tool[];
  return items;
});
</script>

<template>
  <Teleport v-if="isMounted && !hamburgerOpen" to="header .hamburger-teleport">
    <div
      class="flex h-full flex-col justify-center pr-6 md:hidden"
      @click="hamburgerOpen = !hamburgerOpen"
    >
      <NuxtIcon name="icon.hamburger" class="fill-label-1 text-2xl" />
    </div>
  </Teleport>
  <Teleport v-if="isMounted && hamburgerOpen" to=".container .teleport">
    <div
      class="fixed inset-0 z-40 bg-[#000000]/[0.6]"
      @click="hamburgerOpen = !hamburgerOpen"
    ></div>
  </Teleport>
  <aside
    class="fixed bottom-0 top-0 z-50 max-h-screen w-[300px] flex-none flex-col border-r border-label-separator bg-background-2 shadow-2xl transition-all duration-200 ease-in-out md:relative"
    :class="hamburgerOpen ? 'left-0 ' : '-left-full md:left-0 md:shadow-none'"
  >
    <div class="flex h-full flex-col">
      <div
        class="flex items-center gap-3 p-3 px-6"
        :class="{
          'pb-1 pt-8': isElectronOnMac,
        }"
        style="-webkit-app-region: drag"
      >
        <div
          class="ml-[-4px] mt-[3px] md:hidden"
          @click="hamburgerOpen = !hamburgerOpen"
        >
          <NuxtIcon name="icon.hamburger" class="fill-label-1 text-2xl" />
        </div>
        <SiteLogo size="small" />
        <span
          v-if="isElectron"
          class="mt-2 inline-block text-xs leading-5 text-label-3"
        >
          v{{ version }}
        </span>
      </div>
      <div class="flex-grow overflow-y-auto">
        <SidebarGroup>
          <SidebarItem
            :title="$t('nav.home')"
            :link="{ name: 'index' }"
            icon="nav.home"
          />
          <SidebarItem
            :title="$t('nav.browse')"
            :link="{ name: 'browse' }"
            icon="nav.browse"
          />
          <SidebarItem
            :title="$t('nav.search')"
            :link="{ name: 'search-term' }"
            icon="nav.search"
          />
          <template v-if="tools.length === 1">
            <SidebarItem
              v-for="tool in tools"
              :key="tool.id"
              :link="tool.link"
              :title="$t(tool.name)"
              :icon="tool.icon"
            />
          </template>
        </SidebarGroup>

        <SidebarGroup
          v-if="tools.length > 1"
          :title="$t('sidebar.tools.title')"
        >
          <SidebarItem
            v-for="tool in tools"
            :key="tool.id"
            :title="tool.name"
            :link="tool.link"
            :icon="tool.icon"
          />
        </SidebarGroup>

        <SidebarGroup :title="$t('sidebar.playlists.title')">
          <SidebarItem
            v-for="collection in collections"
            :key="collection.id"
            type="playlist"
            :title="collection.name || ''"
            :link="{
              name: 'playlist-private-id',
              params: { id: collection.id },
            }"
            :icon="
              collection.useLikeIcon
                ? 'icon.category.favorites'
                : 'icon.category.playlist'
            "
          />
          <SidebarAddPlaylist></SidebarAddPlaylist>
        </SidebarGroup>
        <SidebarDesktopPromo v-if="!isElectron" />
      </div>
    </div>
  </aside>
</template>
