<script lang="ts" setup>
import { RoutesNamedLocations } from "~/.nuxt/typed-router/__routes";

const links: {
  title: string;
  link: RoutesNamedLocations;
  icon: string;
}[] = [
  { title: "Home", link: { name: "index" }, icon: "nav.home" },
  { title: "Browse", link: { name: "browse" }, icon: "nav.browse" },
  { title: "Search", link: { name: "search" }, icon: "nav.search.fill" },
];

const { data: collections } = usePrivatePlaylists();
</script>

<template>
  <aside
    class="flex max-h-screen min-w-[300px] flex-col border-r border-label-separator bg-background-2"
  >
    <div class="flex items-center p-3">
      <SiteLogo size="small" />
      <span
        class="mx-2 mt-1 inline-block rounded-xl bg-tint px-[5px] text-[13px] leading-5"
        >Alpha v0.0.2</span
      >
    </div>
    <div class="flex-grow overflow-y-auto">
      <SidebarGroup>
        <SidebarItem
          v-for="(link, i) in links"
          :key="`${link.link}_${i}`"
          v-bind="link"
        />
      </SidebarGroup>

      <SidebarGroup title="Playlists">
        <SidebarItem
          v-for="collection in collections"
          :key="collection.id"
          :type="'playlist'"
          :title="collection.name || ''"
          :link="{
            name: 'playlist-private-id',
            params: { id: collection.id },
          }"
          :icon="'icon.category.playlist'"
        />
      </SidebarGroup>
    </div>
  </aside>
</template>
