<script lang="ts" setup>
import { version } from "~/package.json";
import { isTranscriptionManager } from "~/utils/roles";

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
        class="flex items-center p-3 px-6"
        :class="{
          'pb-1 pt-8': isElectronOnMac,
        }"
        style="-webkit-app-region: drag"
      >
        <div
          class="ml-[-4px] mt-[3px] pr-3 md:hidden"
          @click="hamburgerOpen = !hamburgerOpen"
        >
          <NuxtIcon name="icon.hamburger" class="fill-label-1 text-2xl" />
        </div>
        <SiteLogo size="small" />
        <span
          class="mx-2 mt-1 inline-block rounded-xl bg-tint px-[5px] text-[13px] leading-5 text-black-1"
          >Beta v{{ version }}</span
        >
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
          <SidebarItem
            v-if="isTranscriptionManager(currentUser)"
            :title="$t('nav.transcribe')"
            :link="{ name: 'transcribe' }"
            icon="icon.information"
          />
          <SidebarItem
            v-if="isLyricsManager(currentUser)"
            :title="$t('nav.lyrics')"
            :link="{ name: 'lyrics' }"
            icon="icon.information"
          />
          <SidebarItem
            v-if="isFraKaareDashboardViewer(currentUser)"
            title="Dashboard"
            :link="{ name: 'dashboards-fra-kaare' }"
            icon="icon.information"
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
            icon="icon.category.playlist"
          />
          <SidebarAddPlaylist></SidebarAddPlaylist>
        </SidebarGroup>
        <SidebarDesktopPromo v-if="!isElectron" />
      </div>
    </div>
  </aside>
</template>
