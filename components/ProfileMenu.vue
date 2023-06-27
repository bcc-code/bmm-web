<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem, Switch } from "@headlessui/vue";

const autoPlayEnabled = ref(false);
</script>
<template>
  <div>
    <Menu as="div" class="relative">
      <div>
        <MenuButton
          class="flex items-center font-bold text-label-1 focus:outline-none"
        >
          Profile
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
          class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-label-separator rounded-md bg-white-1 text-sm shadow-lg ring-1 ring-opacity-5 focus:outline-none dark:divide-label-dark-separator"
        >
          <div class="px-1 py-1">
            <MenuItem v-slot="{ active }" as="div" class="flex items-center">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left hover:bg-[red]"
                @click="
                  (e) => {
                    autoPlayEnabled = !autoPlayEnabled;
                    e.preventDefault();
                  }
                "
              >
                Auto Play
              </button>
              <Switch
                v-model="autoPlayEnabled"
                :class="autoPlayEnabled ? 'bg-tint' : 'bg-background-2'"
                class="relative inline-flex h-[24px] w-[40px] shrink-0 cursor-pointer rounded-full p-[4px] transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <span
                  aria-hidden="true"
                  :class="autoPlayEnabled ? 'translate-x-[100%]' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white-1 shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left hover:bg-[red]"
                @click="
                  (e) => {
                    e.preventDefault();
                  }
                "
              >
                Theme
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left hover:bg-[red]"
                @click="
                  (e) => {
                    e.preventDefault();
                  }
                "
              >
                Language
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left hover:bg-[red]"
                @click="
                  (e) => {
                    e.preventDefault();
                  }
                "
              >
                Content Language
              </button>
            </MenuItem>
          </div>
          <div class="px-1 py-1">
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left hover:bg-[red]"
                @click="
                  (e) => {
                    e.preventDefault();
                  }
                "
              >
                Feedback
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left hover:bg-[red]"
                @click="
                  (e) => {
                    e.preventDefault();
                  }
                "
              >
                Contact
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left hover:bg-[red]"
                @click="
                  (e) => {
                    e.preventDefault();
                  }
                "
              >
                About BMM
              </button>
            </MenuItem>
          </div>
          <div class="px-1 py-1">
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left hover:bg-[red]"
                @click="
                  (e) => {
                    e.preventDefault();
                  }
                "
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
