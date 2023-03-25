import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/views/HomeView.vue"),
      meta: {
        toolbarTitle: 'Home'
      }
    },
    {
      path: "/browse",
      component: () => import("@/views/BrowseView.vue"),
      meta: {
        toolbarTitle: 'Browse'
      }
    },
    {
      path: "/search",
      component: () => import("@/views/SearchView.vue"),
      meta: {
        toolbarTitle: 'Search'
      }
    },
    {
      name: "CuratedPlaylistDetails",
      path: "/playlist/curated/:playlistId",
      component: () => import("@/views/Playlist/CuratedPlaylistDetails.vue"),
      props: true,
      meta: {
        toolbarTitle: 'Playlist'
      }
    },
    {
      name: "PrivatePlaylist",
      path: "/playlist/private/:id",
      component: () => import("@/views/Playlist/PrivatePlaylist.vue"),
      props: true,
      meta: {
        toolbarTitle: 'Playlist',
      }
    },
  ],
});

export default router;
