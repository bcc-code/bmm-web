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
      component: () => import("@/pages/index.vue"),
      meta: {
        toolbarTitle: reactiveTranslation(() => t("nav.home")),
      },
    },
    {
      path: "/browse",
      component: () => import("@/pages/browse.vue"),
      meta: {
        toolbarTitle: reactiveTranslation(() => t("nav.browse")),
      },
    },
    {
      path: "/search",
      component: () => import("@/pages/search.vue"),
      meta: {
        toolbarTitle: reactiveTranslation(() => t("nav.search")),
      },
    },
    {
      name: "CuratedPlaylistDetails",
      path: "/playlist/curated/:playlistId",
      component: () => import("@/pages/playlist/[id].vue"),
      props: true,
      meta: {
        toolbarTitle: reactiveTranslation(() => t("nav.playlist")),
      },
    },
    {
      name: "PrivatePlaylist",
      path: "/playlist/private/:id",
      component: () => import("@/pages/playlist/private/[id].vue"),
      props: true,
      meta: {
        toolbarTitle: reactiveTranslation(() => t("nav.playlist")),
      },
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
