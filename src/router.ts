import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: import("@/views/HomeView.vue"),
    },
    {
      path: "/browse",
      component: () => import("@/views/BrowseView.vue"),
    },
    {
      path: "/search",
      component: () => import("@/views/SearchView.vue"),
    },
  ],
});

export default router;
