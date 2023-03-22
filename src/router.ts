import Home from "@/views/HomeView.vue";
import { createRouter, createWebHistory } from "vue-router";

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
      path: '/playlist/private/:id',
      props: true,
      component: () => import('@/views/Playlist/PrivatePlaylist.vue')
    }
  ],
});
