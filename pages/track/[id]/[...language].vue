<script lang="ts" setup>
const { setQueue } = useNuxtApp().$mediaPlayer;
const router = useRouter();
const { id, language } = useRoute<"track-id-language">().params;

const options = { id: Number(id) };

const req = useTrackIDWithLanguage(language[0]!, options);
req
  .then(async ({ data }) => {
    if (data.value) {
      setQueue([data.value]);
      await router.replace({
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
