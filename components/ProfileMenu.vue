<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import type { UserModel } from "@bcc-code/bmm-sdk-fetch";
import { Switch, RadioGroup, RadioGroupOption } from "@headlessui/vue";
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

const auth0 = useAuth0();
const logout = async () => {
  try {
    await auth0.logout({ openUrl: false });
  } catch (e) {
    // TODO: Show an error message to the user
    console.error(e);
  }
};

const contentLanguages = ref(
  contentLanguageStore().contentLanguages.filter((x) => x !== "zxx"),
);

const nextUnusedContentLanguage = computed(() =>
  availableContentLanguages.find((x) => !contentLanguages.value.includes(x)),
);

const closeInterfaceLanguageDialog = () => {
  showInterfaceLanguageDialog.value = false;
};

const saveAndCloseContentLanguageDialog = () => {
  showContentLanguageDialog.value = false;

  const newLanguages = ["zxx", ...contentLanguages.value];
  if (
    newLanguages.toString() !==
    contentLanguageStore().contentLanguages.toString()
  )
    contentLanguageStore().contentLanguages = newLanguages;
};

const { data: user } = useCurrentUser();
</script>
<template>
  <div>
    <DropdownMenu placement="bottom-end">
      <button
        class="type-subtitle-1 flex items-center gap-2 rounded-full px-4 py-2 text-label-1 outline-label-separator hover:bg-background-2 hover:outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-label-1"
      >
        <span>{{ $t("profile.title") }}</span>
        <FadeInImage
          v-if="auth0.user.value?.picture"
          :src="auth0.user.value.picture"
          :alt="auth0.user.value.name || ''"
          class="aspect-square w-6 rounded-full object-cover"
        />
        <NuxtIcon v-else name="nav.profile" class="ml-1 text-xl" />
      </button>

      <template #items>
        <DropdownMenuGroup>
          <!-- Todo: #284 implement autoplay behavior -->
          <DropdownMenuItem
            v-if="false"
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
          <DropdownMenuItem :title="$t('profile.logout')" @click="logout()" />
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
            class="type-title-2 min-w-[100px] rounded-lg bg-background-1 px-2 py-1.5 text-label-1 shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
          >
            <select v-model="profileStore.uiLanguage" class="py-1">
              <option
                v-for="(lang, i) in $i18n.availableLocales"
                :key="`Lang${i}`"
                :value="lang"
              >
                {{ getLocalizedLanguageName(lang) }} ({{
                  getLocalizedLanguageName(lang, true)
                }})
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
            class="type-title-2 min-w-min rounded-lg bg-background-1 px-2 py-1.5 text-label-1 shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
          >
            <select v-model="contentLanguages[i]" class="w-full py-1">
              <option
                v-for="(lang, j) in [
                  item,
                  ...availableContentLanguages.filter(
                    (x) => !contentLanguages.includes(x),
                  ),
                ]"
                :key="`Lang${j}`"
                :value="lang"
              >
                {{ getLocalizedLanguageName(lang) }} ({{
                  getLocalizedLanguageName(lang, true)
                }})
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
