<script lang="ts" setup>
import { DownloadLinksApi } from "@bcc-code/bmm-sdk-fetch";
import { UAParser } from "ua-parser-js";

const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("download.download"));

const api = new DownloadLinksApi();
const links = await api.downloadLinksGet();

function isAppleSilicon() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");

    // Best guess if the device is an Apple Silicon
    // https://stackoverflow.com/a/65412357
    // @ts-expect-error - Object is possibly 'null'
    return gl.getSupportedExtensions().includes("WEBGL_compressed_texture_etc");
  } catch {
    return false;
  }
}

function linkForOperatingSystem() {
  const { device } = UAParser(navigator.userAgent);

  if (device.type === "mobile") {
    return device.vendor === "Apple" ? links.ios : links.android;
  }
  if (device.vendor === "Apple") {
    return isAppleSilicon() ? links.macArm : links.macIntel;
  }
  return links.windows;
}
</script>

<template>
  <div>
    <div class="flex h-[85vh] flex-col">
      <div class="h-28 shrink"></div>
      <div class="flex justify-center">
        <img src="public/download-apps-bar.png" width="991.5" height="220.5" />
      </div>
      <div class="h-[72px] shrink"></div>
      <div class="type-display-1 p-6 text-center">
        {{ $t("download.get-for-desktop") }}
      </div>
      <div class="h-5 shrink"></div>
      <div class="flex flex-col items-center justify-center">
        <NuxtLink :to="linkForOperatingSystem() || ''" class="mb-8 mt-5">
          <ButtonStyled intent="primary" size="large" class="w-[345px] text-lg"
            >{{ t("download.download") }}
          </ButtonStyled>
        </NuxtLink>
        <div class="type-paragraph-3 flex gap-5 text-center text-black-3">
          <div>
            <NuxtLink :to="links.windows || ''">
              <ButtonStyled class="" size="small"
                >{{ t("download.download-windows") }}
              </ButtonStyled>
            </NuxtLink>
          </div>

          <div>
            <NuxtLink :to="links.macIntel || ''">
              <ButtonStyled class="" size="small"
                >{{ t("download.download-mac-intel") }}
              </ButtonStyled>
            </NuxtLink>
            <div>{{ t("download.mac-intel-explanation") }}</div>
          </div>

          <div>
            <NuxtLink :to="links.macArm || ''">
              <ButtonStyled size="small"
                >{{ t("download.download-mac-arm") }}
              </ButtonStyled>
            </NuxtLink>
            <div>{{ t("download.mac-arm-explanation") }}</div>
          </div>
        </div>
      </div>
      <div class="h-28 shrink"></div>
    </div>

    <div v-if="false">
      <h2 class="pb-4 pt-10 text-[28px] font-extrabold">
        {{ t("download.download-bmm-app") }}
      </h2>
      <NuxtLink :to="linkForOperatingSystem() || ''">
        <ButtonStyled intent="primary" class="mb-4"
          >{{ t("download.download") }}
        </ButtonStyled>
      </NuxtLink>

      <h3 class="pt-3 text-[20px] font-bold">{{ t("download.mobile") }}</h3>

      <div class="flex">
        <NuxtLink :to="links.ios || ''" target="_blank" class="pt-[15px]">
          <img src="/appstore_en.svg" width="190" />
        </NuxtLink>

        <NuxtLink :to="links.android || ''" target="_blank">
          <img src="/google-play-badge.png" width="240" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
