<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem, Switch } from "@headlessui/vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { useLocalStorage } from "@vueuse/core";

const autoPlayEnabled = useLocalStorage("auto-play", false);

const auth0 = useAuth0();
const logout = async () => {
  try {
    await auth0.logout({ openUrl: false });
  } catch (e) {
    console.error(e);
  }
};
</script>
<template>
  <div>
    <Menu as="div" class="relative">
      <div>
        <MenuButton
          class="flex items-center font-bold text-label-1 focus:outline-none dark:text-label-dark-1"
        >
          {{ $t("nav.profile") }}
          <NuxtIcon name="nav.profile" class="ml-1 text-xl" />
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
                    autoPlayEnabled = !autoPlayEnabled;
                  }
                "
              >
                <span>Auto Play</span>
                <Switch
                  v-model="autoPlayEnabled"
                  :class="
                    autoPlayEnabled
                      ? 'bg-tint dark:bg-tint-dark'
                      : 'bg-background-2 dark:bg-background-dark-2'
                  "
                  class="relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    aria-hidden="true"
                    :class="
                      autoPlayEnabled ? 'translate-x-full' : 'translate-x-0'
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
                @click="
                  (e: MouseEvent) => {
                    e.preventDefault();
                  }
                "
              >
                Theme
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="{
                  'bg-label-separator dark:bg-label-dark-separator': active,
                }"
                class="w-full rounded-lg px-3 py-2 text-left"
                @click="
                  (e: MouseEvent) => {
                    e.preventDefault();
                  }
                "
              >
                Language
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="{
                  'bg-label-separator dark:bg-label-dark-separator': active,
                }"
                class="w-full rounded-lg px-3 py-2 text-left"
                @click="
                  (e: MouseEvent) => {
                    e.preventDefault();
                  }
                "
              >
                Content Language
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
                User Voice
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
                Contact
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
                Sign Out
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
