<script lang="ts" setup>
import { RoutesNamedLocations } from "~/.nuxt/typed-router/__routes";

const links: {
  title: string;
  link: RoutesNamedLocations;
}[] = [
  { title: "Home", link: { name: "index" } },
  { title: "Browse", link: { name: "browse" } },
  { title: "Search", link: { name: "search" } },
];

const { data: collections } = useTrackCollections();
</script>

<template>
  <aside
    class="flex max-h-screen min-w-[300px] flex-col border-r border-label-separator"
  >
    <div class="p-3">
      <SiteLogo size="small" />
    </div>
    <div class="flex-grow overflow-y-auto">
      <ChangeLocale />
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
          :key="collection.id || 0"
          :title="collection.name || ''"
          :link="{
            name: 'playlist-private-id',
            params: { id: collection.id || 0 },
          }"
        />
      </SidebarGroup>
    </div>
  </aside>
</template>
