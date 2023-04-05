<script lang="ts" setup>
const links: Record<"title" | "url", string>[] = [
  { title: "Home", url: "/" },
  { title: "Browse", url: "/browse" },
  { title: "Search", url: "/search" },
];
</script>

<template>
  <aside class="min-w-[250px] bg-slate-100 p-6">
    <ul>
      <SidebarItem
        v-for="(link, i) in links"
        :key="`${link.url}_${i}`"
        v-bind="link"
      />
    </ul>
  </aside>
</template>
