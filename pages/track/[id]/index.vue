<script lang="ts" setup>
const { setQueue } = useNuxtApp().$mediaPlayer;
const router = useRouter();
const { id } = useRoute<"track-id">().params;

const request = await useTrack({ id: Number(id) });
const track = request.data.value;

if (track) {
  setQueue([track]);
  router.replace({ name: "album-id", params: { id: Number(track?.parentId) } });
}
</script>
<template>
  <div></div>
</template>
