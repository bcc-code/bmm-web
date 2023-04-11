<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { Ref, ref, watch } from "vue";
import privatePlaylist from "@/components/privatePlaylist.vue";
import ChangeLocale from "./components/ChangeLocale.vue";
import Toolbar from "./components/AppToolbar.vue";
import { useI18n } from "vue-i18n";

// logout
const { isLoading, loginWithRedirect, isAuthenticated } = useAuth0();
watch(isLoading, async (loading) => {
  if (loading) return;
  if (!isAuthenticated.value) {
    await loginWithRedirect();
  }
});

const navLinks: Ref<{ to: string; name: string }[]> = ref([]);
const { locale, t } = useI18n();
watch(
  locale,
  () => {
    navLinks.value = [
      { to: "/", name: t("nav.home") },
      { to: "/browse", name: t("nav.browse") },
      { to: "/search", name: t("nav.search") },
    ];
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex">
    <nav
      class="bg-gray-50 border-r border-gray-100 p-4 sticky top-0 h-screen min-w-[200px]"
    >
      <change-locale />
      <router-link
        v-for="link in navLinks"
        :key="link.name"
        :to="link.to"
        class="p-2 rounded-lg flex"
        active-class="bg-lime-400"
      >
        {{ link.name }}
      </router-link>
      <privatePlaylist v-if="isAuthenticated" />
    </nav>
    <div class="grow">
      <Toolbar />
      <main class="p-5 grow">
        <router-view v-if="isAuthenticated" />
      </main>
    </div>
  </div>
</template>
