import { Ref, ref, watch } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import i18n from "./plugins/i18n";

declare module "vue-router" {
  interface RouteMeta {
    toolbarTitle: Ref<string>;
  }
}

const { locale, t } = i18n.global;
const reactiveTranslation: (translate: () => string) => Ref<string> = (
  translate
) => {
  const translation: Ref<string> = ref(translate());
  watch(locale, () => {
    translation.value = translate();
  });
  return translation;
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/views/HomeView.vue"),
      meta: {
        toolbarTitle: reactiveTranslation(() => t("nav.home")),
      },
    },
    {
      path: "/browse",
      component: () => import("@/views/BrowseView.vue"),
      meta: {
        toolbarTitle: reactiveTranslation(() => t("nav.browse")),
      },
    },
    {
      path: "/search",
      component: () => import("@/views/SearchView.vue"),
      meta: {
        toolbarTitle: reactiveTranslation(() => t("nav.search")),
      },
    },
    {
      name: "CuratedPlaylistDetails",
      path: "/playlist/curated/:playlistId",
      component: () => import("@/views/Playlist/CuratedPlaylistDetails.vue"),
      props: true,
      meta: {
        toolbarTitle: reactiveTranslation(() => t("nav.playlist")),
      },
    },
    {
      name: "PrivatePlaylist",
      path: "/playlist/private/:id",
      component: () => import("@/views/Playlist/PrivatePlaylist.vue"),
      props: true,
      meta: {
        toolbarTitle: reactiveTranslation(() => t("nav.playlist")),
      },
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
