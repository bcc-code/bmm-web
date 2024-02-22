<script lang="ts" setup>
const { setQueue } = useNuxtApp().$mediaPlayer;
const router = useRouter();
const { id, language } = useRoute<"track-id-language">().params;

const options = { id: Number(id) };
const request = language[0]
  ? await useTrackIDWithLanguage(language[0], options)
  : await useTrack(options);
const track = request.data.value;

if (track) {
  setQueue([track]);
  router.replace({ name: "album-id", params: { id: Number(track?.parentId) } });
}
</script>
<template>
  <div></div>
</template>
