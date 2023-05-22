<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem, Switch } from "@headlessui/vue";

const enabled = ref(false);
</script>
<template>
  <div class="text-right">
    <Menu as="div" class="relative inline-block text-left">
      <div>
        <MenuButton
          class="text-white focus-visible:ring-white inline-flex w-full justify-center rounded-md bg-opacity-20 px-4 font-bold text-label-1 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75"
        >
          Profile
          <IconComponent
            name="nav.profile"
            class="-mr-1 ml-1 text-xl font-bold group-hover:text-4xl"
            aria-hidden="true"
          />
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
          class="divide-gray-100 ring-black absolute right-0 mt-2 w-56 origin-top-right divide-y rounded-md bg-white-1 shadow-lg ring-1 ring-opacity-5 focus:outline-none"
        >
          <div class="list-none px-1 py-1">
            <MenuItem v-slot="{ active }" as="div" class="flex justify-between">
              <button
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm',
                ]"
              >
                Auto Play
              </button>
              <Switch
                v-model="enabled"
                :class="enabled ? 'bg-teal-[500]' : 'bg-teal-[500]'"
                class="border-transparent focus-visible:ring-white relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75"
              >
                <!-- <span class="sr-only">Use setting</span> -->
                <span
                  aria-hidden="true"
                  :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                  class="bg-white pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                Theme
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                Language
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                Content Language
              </button>
            </MenuItem>
          </div>
          <div class="list-none px-1 py-1">
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                Feedback
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                Contact
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                About BMM
              </button>
            </MenuItem>
          </div>
          <div class="list-none px-1 py-1">
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
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
