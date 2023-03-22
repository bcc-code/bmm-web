import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/browse",
      component: () => import("@/views/BrowseView.vue"),
    },
    {
      path: "/search",
      component: () => import("@/views/SearchView.vue"),
    },
    {
      name: "CuratedPlaylistDetails",
      path: "/playlist/curated/:playlistId",
      component: () => import("@/views/CuratedPlaylistDetails.vue"),
      props: true,
    },
  ],
});
