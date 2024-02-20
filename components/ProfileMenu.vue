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
import { VueDraggable } from "vue-draggable-plus";

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
locale.value = profileStore.uiLanguage;

const languageName = computed(() => getLocalizedLanguageName(locale));
const contentLanguages = ref(
  contentLanguageStore().contentLanguages.filter((x) => x !== "zxx"),
);
const joinedContentLanguages = computed(() => {
  const list = contentLanguages.value;
  return getLocalizedList(list.map((x) => getLocalizedLanguageName(x)));
});
const nextUnusedContentLanguage = () =>
  availableContentLanguages.filter(
    (x) => !contentLanguages.value.includes(x),
  )[0];

const closeInterfaceLanguageDialog = () => {
  profileStore.uiLanguage = locale.value;
  showInterfaceLanguageDialog.value = false;
};
const closeContentLanguageDialog = () => {
  showContentLanguageDialog.value = false;
  const newLanguages = contentLanguages.value.concat(["zxx"]);
  if (
    newLanguages.toString() !==
    contentLanguageStore().contentLanguages.toString()
  )
    contentLanguageStore().contentLanguages = newLanguages;
};
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
            <!-- Todo: #284 implement autoplay behavior -->
            <MenuItem v-if="false" v-slot="{ active }">
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
        class="bg-background-2 dark:bg-background-dark-2 rounded-lg font-semibold"
      >
        <RadioGroupOption
          v-for="mode in colorModes"
          :key="mode"
          :value="mode"
          class="flex justify-between px-4 py-3 cursor-pointer hover:bg-label-separator w-full rounded-lg"
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
      @close="closeInterfaceLanguageDialog()"
    >
      <div class="bg-background-2 text-label-2 rounded-2xl p-3">
        <label class="self-center flex items-center gap-4 justify-between">
          <span>{{ $t("profile.select-language") }}</span>
          <div
            class="text-label-1 bg-background-1 min-w-[100px] px-2 py-1.5 rounded-lg font-semibold shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
          >
            <select v-model="$i18n.locale" class="py-1">
              <option
                v-for="(lang, i) in $i18n.availableLocales"
                :key="`Lang${i}`"
                :value="lang"
              >
                {{
                  `${languageDictionary[lang]?.NativeName} (${languageDictionary[lang]?.EnglishName})`
                }}
              </option>
            </select>
          </div>
        </label>
      </div>
    </DialogBase>

    <DialogBase
      :show="showContentLanguageDialog"
      :title="$t('profile.content-language')"
      :description="$t('profile.content-language-description')"
      @close="closeContentLanguageDialog()"
    >
      <VueDraggable
        v-model="contentLanguages"
        handle=".handle"
        :animation="200"
        class="bg-background-2 rounded-2xl divide-y divide-label-separator"
      >
        <div
          v-for="(item, i) in contentLanguages"
          :key="item"
          class="grid grid-cols-[24px_1fr_1.5fr_24px] items-center px-4 py-3 gap-4 w-full first:rounded-t-2xl last:rounded-b-2xl"
        >
          <button class="handle text-label-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 9H20" stroke="currentColor" stroke-width="2" />
              <path d="M4 15H20" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
          <div>
            {{ t("profile.preference-language-" + Math.min(i + 1, 4), i + 1) }}
          </div>
          <div
            class="text-label-1 bg-background-1 min-w-min px-2 py-1.5 rounded-lg font-semibold shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
          >
            <select v-model="contentLanguages[i]" class="py-1 w-full">
              <option
                v-for="(lang, i) in availableContentLanguages
                  .filter((x) => !contentLanguages.includes(x))
                  .concat([item])"
                :key="`Lang${i}`"
                :value="lang"
              >
                {{
                  `${languageDictionary[lang]?.NativeName} (${getLocalizedLanguageName(lang)})`
                }}
              </option>
            </select>
          </div>

          <button
            v-if="i > 0"
            class="text-2xl"
            @click="contentLanguages.splice(i, 1)"
          >
            <NuxtIcon name="icon.close.small" />
          </button>
        </div>
      </VueDraggable>
      <div
        v-if="nextUnusedContentLanguage()"
        class="text-label-3 p-3 flex flex-row gap-2 mt-4"
        @click="
          () => {
            const next = nextUnusedContentLanguage();
            if (next) contentLanguages.push(next);
          }
        "
      >
        <NuxtIcon name="icon.add"></NuxtIcon>
        {{ t("profile.add-another-language") }}
      </div>
    </DialogBase>
  </div>
</template>
