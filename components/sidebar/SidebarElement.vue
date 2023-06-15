<script lang="ts" setup>
import { useAuth0 } from "@auth0/auth0-vue";
import { RoutesNamedLocations } from "~/.nuxt/typed-router/__routes";
import { version } from "~/package.json";

const links: {
  title: string;
  link: RoutesNamedLocations;
  icon: string;
}[] = [
  { title: "Home", link: { name: "index" }, icon: "nav.home" },
  { title: "Browse", link: { name: "browse" }, icon: "nav.browse" },
  { title: "Search", link: { name: "search" }, icon: "nav.search" },
];

const { data: collections } = usePrivatePlaylists();
const auth0 = useAuth0();
const logout = async () => {
  try {
    await auth0.logout({ openUrl: false });
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <aside
    class="flex max-h-screen min-w-[300px] flex-col border-r border-label-separator bg-background-2"
  >
    <div class="flex items-center p-3">
      <SiteLogo size="small" />
      <span
        class="mx-2 mt-1 inline-block rounded-xl bg-tint px-[5px] text-[13px] leading-5"
        >Alpha v{{ version }}</span
      >
    </div>
    <div class="flex-grow overflow-y-auto">
      <SidebarGroup>
        <SidebarItem
          v-for="(link, i) in links"
          :key="`${link.link}_${i}`"
          v-bind="link"
        />
        <a
          @click="logout()"
          href="#"
          class="group flex gap-2 rounded-xl px-4 py-2"
        >
          <span class="transition-transform group-hover:translate-x-2">
            Logout
          </span>
        </a>
      </SidebarGroup>

      <SidebarGroup title="Playlists">
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
      </SidebarGroup>
    </div>
  </aside>
</template>
