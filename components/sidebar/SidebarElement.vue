<script lang="ts" setup>
import { version } from "~/package.json";

const { data: collections } = usePrivatePlaylists();
const isElectron = window.isElectron || false;
</script>

<template>
  <aside
    class="flex-none flex max-h-screen w-[300px] flex-col border-r border-label-separator bg-background-2"
  >
    <div
      class="flex items-center p-3"
      style="
        -webkit-app-region: drag;
        -webkit-user-select: none;
        user-select: none;
      "
    >
      <SiteLogo v-if="!isElectron" size="small" />
      <span
        v-if="!isElectron"
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
    </div>
  </aside>
</template>
