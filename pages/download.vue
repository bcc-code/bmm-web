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

    <h3 class="pt-3 text-[20px] font-bold">{{ t("download.desktop") }}</h3>
    <div class="flex gap-6 underline">
      <NuxtLink :to="links.windows || ''">{{
        t("download.os.windows")
      }}</NuxtLink>
      <NuxtLink :to="links.macIntel || ''">{{
        t("download.os.mac_intel")
      }}</NuxtLink>
      <NuxtLink :to="links.macArm || ''">{{
        t("download.os.mac_arm")
      }}</NuxtLink>
    </div>
  </div>
</template>
