<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem, Switch } from "@headlessui/vue";

const enabled = ref(false);
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
                class="w-full px-2 py-2 text-left"
              >
                Auto Play
              </button>
              <Switch
                v-model="enabled"
                :class="enabled ? 'bg-teal-[500]' : 'bg-teal-[500]'"
                class="border-transparent focus-visible:ring-white relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75"
              >
                <span
                  aria-hidden="true"
                  :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                  class="bg-white pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left"
              >
                Theme
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left"
              >
                Language
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left"
              >
                Content Language
              </button>
            </MenuItem>
          </div>
          <div class="px-1 py-1">
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left"
              >
                Feedback
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left"
              >
                Contact
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left"
              >
                About BMM
              </button>
            </MenuItem>
          </div>
          <div class="px-1 py-1">
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="active ? 'bg-violet-500 text-white' : 'text-gray-900'"
                class="w-full px-2 py-2 text-left"
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
