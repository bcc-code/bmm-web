<script lang="ts" setup>
// import type { NuxtIconName } from '.nuxt/nuxt-icons';

const { t } = useI18n();

const props = defineProps<{
  trackId: number;
}>();

const emit = defineEmits<{
  close: [];
}>();

const message = ref<string | null>(null);

// TODO: Make this dynamic
const trackLink = `http://localhost:9001/track/${props.trackId}`;

const setMessage = (newMessage: string) : Promise<null> => new Promise((resolve) => {
    message.value = newMessage;
    setTimeout(() => {
      message.value = null;
      resolve(null);
    }, 2000);
  });

const shareButtons = {
  facebook: {
    text: t("track.dropdown.share-facebook"),
    icon: "icon.facebook",
    link: `https://www.facebook.com/sharer/sharer.php?u=${trackLink}`,
    backgroundColor: "#3b5998",
  },
  x: {
    text: t("track.dropdown.share-x"),
    icon: "icon.x",
    link: `https://x.com/intent/tweet?text=${trackLink}`,
    backgroundColor: "#1da1f2",
  },
  whatsapp: {
    text: t("track.dropdown.share-whatsapp"),
    icon: "icon.whatsapp",
    link: `https://api.whatsapp.com/send?text=${trackLink}`,
    backgroundColor: "#25d366",
  },
  email: {
    text: t("track.dropdown.share-email"),
    icon: "icon.email",
    link: `mailto:?body=${trackLink}`,
    backgroundColor: "#777788",
  },
  clipboard: {
    text: t("track.dropdown.share-clipboard"),
    icon: "icon.clipboard",
    clickFunction: async () => {
      navigator.clipboard.writeText(trackLink);
      await setMessage("Copied link to clipboard")
      emit("close");
    },
    backgroundColor: "#777788",
  },
};
</script>

<template>
  <DialogBase
    :show="true"
    :title="t('track.dropdown.share')"
    @close="emit('close')"
  >
    <div class="grid grid-cols-3 gap-4 rounded-md p-4 relative">
      <div
        v-for="shareButton in Object.values(shareButtons)" :key="shareButton.text"
        class="flex items-center justify-between rounded-md text-white-1 w-full h-full hover:opacity-90" :style="{ backgroundColor: shareButton.backgroundColor }"
      >
        <NuxtLink v-if="'link' in shareButton" :to="shareButton.link" class="flex items-center gap-2 h-full w-full p-4" target="_blank" rel="noopener noreferrer">
          <!--<NuxtIcon :name="(shareButton.icon as NuxtIconName)" />-->
          <NuxtIcon name="icon.link" />
          <span>{{ shareButton.text }}</span>
        </NuxtLink>
        <button
          v-else class="flex items-center gap-2 h-full w-full p-4" @click="shareButton.clickFunction?.()">
          <NuxtIcon name="icon.link" />
          <span>{{ shareButton.text }}</span>
        </button>
      </div>
      <div v-if="message" class="absolute inset-0 backdrop-filter backdrop-blur-sm bg-white-1/50"></div>
      <div v-if="message" class="absolute inset-0 font-bold w-full h-full flex justify-center items-center">
        <p>{{ message }}</p>
      </div>
    </div>
  </DialogBase>
</template>
