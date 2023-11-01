<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem, Switch } from "@headlessui/vue";
import { useAuth0 } from "@auth0/auth0-vue";

const profileStore = useProfileStore();

const auth0 = useAuth0();
const logout = async () => {
  try {
    await auth0.logout({ openUrl: false });
  } catch (e) {
    console.error(e);
  }
};

const { locale } = useI18n();
const languageName = computed(() => getLocalizedLanguageName(locale));
const { contentLanguages } = contentLanguageStore();
</script>
<template>
  <div>
    <Menu as="div" class="relative">
      <div>
        <MenuButton
          class="flex items-center gap-2 font-bold text-label-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-label-1 dark:text-label-dark-1"
        >
          <span>{{ $t("profile.title") }}</span>
          <img
            v-if="auth0.user.value?.picture"
            :src="auth0.user.value.picture"
            :alt="auth0.user.value.name || ''"
            class="aspect-square w-6 rounded-full object-cover"
          />
          <NuxtIcon v-else name="nav.profile" class="ml-1 text-xl" />
        </MenuButton>
      </div>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-label-separator rounded-xl bg-white-1 text-sm shadow-lg ring-1 ring-label-separator focus-visible:outline-none dark:divide-label-dark-separator dark:bg-background-dark-3"
        >
          <div class="p-1">
            <MenuItem v-slot="{ active }">
              <button
                :class="{
                  'bg-label-separator dark:bg-label-dark-separator': active,
                }"
                class="flex w-full items-center justify-between rounded-lg px-3 py-2"
                @click="
                  (e: MouseEvent) => {
                    e.preventDefault();
                    profileStore.autoplay = !profileStore.autoplay;
                  }
                "
              >
                <span>{{ $t("profile.autoplay") }}</span>
                <Switch
                  v-model="profileStore.autoplay"
                  :class="
                    profileStore.autoplay
                      ? 'bg-tint dark:bg-tint-dark'
                      : 'bg-background-2 dark:bg-background-dark-2'
                  "
                  class="relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    aria-hidden="true"
                    :class="
                      profileStore.autoplay
                        ? 'translate-x-full'
                        : 'translate-x-0'
                    "
                    class="pointer-events-none inline-block aspect-square w-4 transform rounded-full bg-white-1 shadow-lg ring-1 ring-black-separator transition duration-200 ease-in-out"
                  />
                </Switch>
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                :class="{
                  'bg-label-separator dark:bg-label-dark-separator': active,
                }"
                class="w-full rounded-lg px-3 py-2 text-left"
                @click.stop
              >
                <p>{{ $t("profile.theme") }}</p>
                <span class="text-label-2 dark:text-label-dark-2">
                  {{
                    $colorMode.value === "light"
                      ? $t("profile.theme-light")
                      : $t("profile.theme-dark")
                  }}
                </span>
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="{
                  'bg-label-separator dark:bg-label-dark-separator': active,
                }"
                class="w-full rounded-lg px-3 py-2 text-left"
                @click.stop
              >
                <p>{{ $t("profile.app-language") }}</p>
                <span class="text-label-2 dark:text-label-dark-2">
                  {{ languageName }}
                </span>
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="{
                  'bg-label-separator dark:bg-label-dark-separator': active,
                }"
                class="w-full rounded-lg px-3 py-2 text-left"
                @click.stop
              >
                <p>{{ $t("profile.content-language") }}</p>
                <span class="text-label-2 dark:text-label-dark-2">
                  {{ contentLanguages.join(", ") }}
                </span>
              </button>
            </MenuItem>
          </div>
          <div class="p-1">
            <MenuItem v-slot="{ active }" as="div">
              <a
                :class="{
                  'bg-label-separator dark:bg-label-dark-separator': active,
                }"
                class="flex w-full rounded-lg px-3 py-2"
                href="https://uservoice.bcc.no/?tags=bmm"
                target="_blank"
              >
                {{ $t("profile.uservoice") }}
              </a>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <a
                :class="{
                  'bg-label-separator dark:bg-label-dark-separator': active,
                }"
                class="flex w-full rounded-lg px-3 py-2"
                href="mailto:bmm-support@bcc.no"
                target="_blank"
              >
                {{ $t("profile.contact") }}
              </a>
            </MenuItem>
          </div>
          <div class="p-1">
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="{
                  'bg-label-separator dark:bg-label-dark-separator': active,
                }"
                class="w-full rounded-lg px-3 py-2 text-left"
                @click="logout()"
              >
                {{ $t("profile.logout") }}
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
