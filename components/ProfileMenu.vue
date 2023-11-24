<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Switch,
  RadioGroup,
  RadioGroupOption,
} from "@headlessui/vue";

const profileStore = useProfileStore();
const { t } = useI18n();

const showInterfaceLanguageDialog = ref(false);
const showContentLanguageDialog = ref(false);
const showThemeDialog = ref(false);

const colorModes = ["system", "light", "dark"] as const;
const getColorModeName = (mode: string) => {
  switch (mode) {
    case "system":
      return t("profile.theme-system");
    case "dark":
      return t("profile.theme-dark");
    default:
      return t("profile.theme-light");
  }
};
const colorMode = useColorMode();
const currentColorTheme = computed(() =>
  getColorModeName(colorMode.preference),
);

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
const joinedContentLanguages = computed(() =>
  getLocalizedList(contentLanguages),
);
</script>
<template>
  <div>
    <Menu as="div" class="relative">
      <div>
        <MenuButton
          class="flex items-center gap-2 font-bold text-label-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-label-1"
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
          class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-label-separator rounded-xl bg-background-3 text-sm shadow-lg ring-1 ring-label-separator focus-visible:outline-none -separator"
        >
          <div class="p-1">
            <MenuItem v-slot="{ active }">
              <button
                :class="{
                  'bg-label-separator -separator': active,
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
                    profileStore.autoplay ? 'bg-tint ' : 'bg-background-2 '
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
                  'bg-label-separator -separator': active,
                }"
                class="w-full rounded-lg px-3 py-2 text-left"
                @click="showThemeDialog = true"
              >
                <p>{{ $t("profile.theme") }}</p>
                <span class="text-label-2">
                  {{ currentColorTheme }}
                </span>
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="{
                  'bg-label-separator -separator': active,
                }"
                class="w-full rounded-lg px-3 py-2 text-left"
                @click="showInterfaceLanguageDialog = true"
              >
                <p>{{ $t("profile.app-language") }}</p>
                <span class="text-label-2">
                  {{ languageName }}
                </span>
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }" as="div">
              <button
                :class="{
                  'bg-label-separator -separator': active,
                }"
                class="w-full rounded-lg px-3 py-2 text-left"
                @click="showContentLanguageDialog = true"
              >
                <p>{{ $t("profile.content-language") }}</p>
                <span class="text-label-2">
                  {{ joinedContentLanguages }}
                </span>
              </button>
            </MenuItem>
          </div>
          <div class="p-1">
            <MenuItem v-slot="{ active }" as="div">
              <a
                :class="{
                  'bg-label-separator -separator': active,
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
                  'bg-label-separator -separator': active,
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
                  'bg-label-separator -separator': active,
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

    <DialogBase
      :show="showThemeDialog"
      title="Theme"
      :description="$t('profile.theme-description')"
      @close="showThemeDialog = false"
    >
      <RadioGroup
        v-model="colorMode.preference"
        class="bg-background-2 dark:bg-background-dark-2 rounded-2xl mt-4 font-semibold"
      >
        <RadioGroupOption
          v-for="mode in colorModes"
          :key="mode"
          :value="mode"
          class="flex justify-between px-4 py-3 cursor-pointer hover:bg-on-color-2 focus-visible:bg-on-color-2 w-full first:rounded-t-2xl last:rounded-b-2xl"
        >
          <span>{{ getColorModeName(mode) }}</span>
          <NuxtIcon
            v-if="mode == colorMode.preference"
            name="icon.selected"
            class="text-2xl group-hover:text-4xl inline-block"
          />
        </RadioGroupOption>
      </RadioGroup>
    </DialogBase>

    <DialogBase
      :show="showInterfaceLanguageDialog"
      :title="$t('profile.interface-language')"
      :description="$t('profile.interface-language-description')"
      @close="showInterfaceLanguageDialog = false"
    >
      <div
        class="flex content-center gap-4 justify-between bg-background-2 dark:bg-background-dark-2 rounded-2xl p-3"
      >
        <div class="inline-block self-center">
          {{ $t("profile.select-language") }}
        </div>
        <ChangeLocale />
      </div>
    </DialogBase>

    <DialogBase
      :show="showContentLanguageDialog"
      :title="$t('profile.content-language')"
      :description="$t('profile.content-language-description')"
      @close="showContentLanguageDialog = false"
    >
      <p style="background-color: rgba(255, 0, 0, 0.4)">Not implemented yet.</p>
    </DialogBase>
  </div>
</template>
