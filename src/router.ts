import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/pages/index.vue"),
    },
    {
      path: "/browse",
      component: () => import("@/pages/browse.vue"),
    },
    {
      path: "/search",
      component: () => import("@/pages/search.vue"),
    },
    {
      name: "CuratedPlaylistDetails",
      path: "/playlist/curated/:id",
      component: () => import("@/pages/playlist/curated/[id].vue"),
      props: true,
    },
    {
      name: "PrivatePlaylist",
      path: "/playlist/private/:id",
      component: () => import("@/pages/playlist/private/[id].vue"),
      props: true,
    },
    {
      name: "error",
      path: "/:path(.*)",
      component: () => import("@/pages/not-found.vue"),
      props: true,
    },
  ],
});

export default router;
