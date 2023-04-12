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
      component: () => import("@/views/Playlist/CuratedPlaylistDetails.vue"),
      props: true,
    },
    {
      name: "PrivatePlaylist",
      path: "/playlist/private/:id",
      component: () => import("@/views/Playlist/PrivatePlaylist.vue"),
      props: true,
    },
    {
      name: "error",
      path: "/:path(.*)",
      component: () => import("@/views/NotFound.vue"),
      props: true,
    },
  ],
});

export default router;
