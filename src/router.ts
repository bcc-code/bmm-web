import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/views/HomeView.vue"),
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

export default router;
