<script lang="ts" setup>
const links: Record<"title" | "url", string>[] = [
  { title: "Home", url: "/" },
  { title: "Browse", url: "/browse" },
  { title: "Search", url: "/search" },
];

const { data: collections } = useTrackCollections();
</script>

<template>
  <aside
    class="min-w-[300px] max-h-[100vh] border-r border-slate-200 flex flex-col"
  >
    <div class="p-3">
      <SiteLogo size="small" />
    </div>
    <div class="flex-grow overflow-y-auto">
      <ChangeLocale />
      <SidebarGroup>
        <SidebarItem
          v-for="(link, i) in links"
          :key="`${link.url}_${i}`"
          v-bind="link"
        />
      </SidebarGroup>

      <SidebarGroup title="Playlists">
        <SidebarItem
          v-for="collection in collections"
          :key="collection.id || 0"
          :title="collection.name || ''"
          :url="`/playlist/private/${collection.id}`"
        />
      </SidebarGroup>
    </div>
  </aside>
</template>
