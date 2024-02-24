<script lang="ts" setup>
const { setQueue } = useNuxtApp().$mediaPlayer;
const router = useRouter();
const { id } = useRoute<"track-id">().params;

const req = useTrack({ id: Number(id) });
req
  .then(({ data }) => {
    if (data.value) {
      setQueue([data.value]);
      router.replace({
        name: "album-id",
        params: { id: Number(data.value.parentId) },
      });
    }
  })
  .catch((error) => console.error(error));
</script>
<template>
  <div>
    <ul v-if="req.pending">
      <li
        v-for="index in 5"
        :key="index"
        class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2"
      ></li>
    </ul>
  </div>
</template>
