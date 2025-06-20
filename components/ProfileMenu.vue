<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import type { LanguageEnum } from "@bcc-code/bmm-sdk-fetch";
import { Switch, RadioGroup, RadioGroupOption } from "@headlessui/vue";
import { VueDraggable } from "vue-draggable-plus";

const profileStore = useProfileStore();
const { t } = useI18n();

const runtimeConfig = useRuntimeConfig();
const isElectron = runtimeConfig.public.systemName === "Electron";

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

const { user: auth0User, logout: auth0Logout } = useAuth0();
const logout = async () => {
  try {
    await auth0Logout({ openUrl: false });
  } catch (e) {
    // TODO: Show an error message to the user
    console.error(e);
  }
};

const contentLanguages = ref(
  useContentLanguageStore().contentLanguages.filter((x) => x !== "zxx"),
);

const nextUnusedContentLanguage = computed(() =>
  availableContentLanguages.find((x) => !contentLanguages.value.includes(x)),
);

const closeInterfaceLanguageDialog = () => {
  showInterfaceLanguageDialog.value = false;
};

const saveAndCloseContentLanguageDialog = () => {
  showContentLanguageDialog.value = false;

  const newLanguages: LanguageEnum[] = [...contentLanguages.value, "zxx"];
  if (
    newLanguages.toString() !==
    useContentLanguageStore().contentLanguages.toString()
  )
    useContentLanguageStore().contentLanguages = newLanguages;
};

const { data: user } = useCurrentUser();
</script>

<template>
  <div v-if="auth0User">
    <DropdownMenu placement="bottom-end">
      <button
        class="type-subtitle-1 flex items-center gap-2 rounded-full px-4 py-2 text-label-1 outline-label-separator hover:bg-background-2 hover:outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-label-1"
      >
        <span>{{ $t("profile.title") }}</span>
        <FadeInImage
          v-if="auth0User.picture"
          :src="auth0User.picture"
          :alt="auth0User.name || ''"
          class="aspect-square w-6 rounded-full object-cover"
        />
        <NuxtIcon v-else name="nav.profile" class="ml-1 text-xl" />
      </button>

      <template #items>
        <DropdownMenuGroup>
          <DropdownMenuItem
            :title="$t('profile.autoplay')"
            @click="
              (e: MouseEvent) => {
                e.preventDefault();
                profileStore.autoplay = !profileStore.autoplay;
              }
            "
          >
            <template #right>
              <Switch
                v-model="profileStore.autoplay"
                :class="profileStore.autoplay ? 'bg-tint ' : 'bg-background-2 '"
                class="relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <span
                  aria-hidden="true"
                  :class="
                    profileStore.autoplay ? 'translate-x-full' : 'translate-x-0'
                  "
                  class="pointer-events-none inline-block aspect-square w-4 transform rounded-full bg-white-1 shadow-lg ring-1 ring-black-separator transition duration-200 ease-in-out"
                />
              </Switch>
            </template>
          </DropdownMenuItem>
          <DropdownMenuItem
            :title="$t('profile.theme')"
            :secondary-title="getColorModeName(colorMode.preference)"
            @click="showThemeDialog = true"
          />
          <DropdownMenuItem
            :title="$t('profile.app-language')"
            :secondary-title="getLocalizedLanguageName(profileStore.uiLanguage)"
            @click="showInterfaceLanguageDialog = true"
          />
          <DropdownMenuItem
            :title="$t('profile.content-language')"
            :secondary-title="
              getLocalizedList(
                contentLanguages.map((x) => getLocalizedLanguageName(x)),
              )
            "
            @click="showContentLanguageDialog = true"
          />
        </DropdownMenuGroup>
        <DropdownMenuGroup v-if="user && isUploader(user)">
          <DropdownMenuItem
            title="Admin"
            href="https://bmm.brunstad.org/admin"
            target="_blank"
          />
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem
            v-if="!isElectron"
            :title="$t('download.download')"
            :to="{ name: 'download' }"
          />
          <DropdownMenuItem
            :title="$t('profile.uservoice')"
            href="https://uservoice.bcc.no/?tags=bmm"
            target="_blank"
          />
          <DropdownMenuItem
            :title="$t('profile.contact')"
            href="mailto:bmm-support@bcc.no"
            target="_blank"
          />
          <DropdownMenuItem
            :title="$t('profile.privacy-policy')"
            :href="
              profileStore.uiLanguage === 'nb'
                ? 'https://bcc.media/no/personvern/'
                : 'https://bcc.media/en/privacy/'
            "
            target="_blank"
          />
          <DropdownMenuItem
            :title="$t('track.details.copyright')"
            :to="{ name: 'copyright' }"
          />
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <div class="flex items-center justify-between gap-4 px-3 py-2">
            <div class="flex flex-col">
              <span class="type-subtitle-2">{{ auth0User.name }}</span>
              <span class="type-subtitle-3 text-label-3">
                {{ auth0User.email }}
              </span>
            </div>
            <DropdownMenuItem>
              <template #item="{ active }">
                <button
                  :class="[
                    'type-subtitle-3 rounded-full bg-background-2 px-2.5 py-1',
                    { 'bg-label-separator': active },
                  ]"
                  @click="logout"
                >
                  {{ $t("profile.logout") }}
                </button>
              </template>
            </DropdownMenuItem>
          </div>
        </DropdownMenuGroup>
      </template>
    </DropdownMenu>

    <DialogBase
      :show="showThemeDialog"
      :title="$t('profile.theme')"
      :description="$t('profile.theme-description')"
      @close="showThemeDialog = false"
    >
      <RadioGroup
        v-model="colorMode.preference"
        class="dark:bg-background-dark-2 type-title-2 rounded-lg bg-background-2 md:w-[500px] lg:w-[600px]"
      >
        <RadioGroupOption
          v-for="mode in colorModes"
          :key="mode"
          :value="mode"
          class="flex w-full cursor-pointer justify-between rounded-lg px-4 py-3 hover:bg-label-separator"
        >
          <span>{{ getColorModeName(mode) }}</span>
          <NuxtIcon
            v-if="mode == colorMode.preference"
            name="icon.selected"
            class="inline-block text-2xl group-hover:text-4xl"
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
      <div
        class="rounded-2xl bg-background-2 p-3 text-label-2 md:w-[500px] lg:w-[600px]"
      >
        <label class="flex items-center justify-between gap-4 self-center">
          <span>{{ $t("profile.select-language") }}</span>
          <div
            class="type-title-2 relative min-w-[100px] rounded-lg bg-background-1 px-2 py-1.5 text-label-1 shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
          >
            <select
              v-model="profileStore.uiLanguage"
              class="appearance-none truncate bg-background-1 py-0.5 pl-1 pr-5 leading-normal"
            >
              <option
                v-for="lang in $i18n.availableLocales"
                :key="lang"
                :value="lang"
              >
                {{ getLocalizedLanguageName(lang) }} ({{
                  getLocalizedLanguageName(lang, true)
                }})
              </option>
            </select>
            <NuxtIcon
              name="icon.chevron.down"
              class="absolute right-2 top-1/2 -translate-y-1/2"
            />
          </div>
        </label>
      </div>
    </DialogBase>

    <DialogBase
      :show="showContentLanguageDialog"
      :title="$t('profile.content-language')"
      :description="$t('profile.content-language-description')"
      @close="saveAndCloseContentLanguageDialog()"
    >
      <VueDraggable
        v-model="contentLanguages"
        handle=".handle"
        :animation="200"
        class="divide-y divide-label-separator rounded-2xl bg-background-2 md:w-[500px] lg:w-[600px]"
      >
        <div
          v-for="(item, i) in contentLanguages"
          :key="item"
          class="grid w-full grid-cols-[24px_1fr_1.5fr_24px] items-center gap-4 px-4 py-3 first:rounded-t-2xl last:rounded-b-2xl"
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
            <!-- eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys -->
            {{ t("profile.preference-language-" + Math.min(i + 1, 4), i + 1) }}
          </div>
          <div
            class="type-title-2 relative min-w-min rounded-lg bg-background-1 px-2 py-1.5 text-label-1 shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
          >
            <select
              v-model="contentLanguages[i]"
              class="w-full appearance-none truncate bg-background-1 py-0.5 pl-1 pr-5 leading-normal"
            >
              <option
                v-for="lang in [
                  item,
                  ...availableContentLanguages.filter(
                    (x) => !contentLanguages.includes(x),
                  ),
                ]"
                :key="lang"
                :value="lang"
              >
                {{ getLocalizedLanguageName(lang) }} ({{
                  getLocalizedLanguageName(lang, true)
                }})
              </option>
            </select>
            <NuxtIcon
              name="icon.chevron.down"
              class="absolute right-2 top-1/2 -translate-y-1/2"
            />
          </div>

          <button
            v-if="contentLanguages.length > 1"
            class="text-2xl"
            @click="contentLanguages.splice(i, 1)"
          >
            <NuxtIcon name="icon.close.small" />
          </button>
        </div>
      </VueDraggable>
      <div
        v-if="nextUnusedContentLanguage"
        class="type-subtitle-1 mt-4 flex cursor-pointer flex-row gap-2 p-3 text-label-3"
        @click="
          () => {
            const next = nextUnusedContentLanguage;
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
