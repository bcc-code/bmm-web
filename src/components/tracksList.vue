<script lang="ts" setup>
import filters from "@/utils/filters";
import { useAuth0 } from "@auth0/auth0-vue";
import { onMounted, ref } from "vue";

// import ProtectedImage from "./ProtectedImage.vue";

const props = defineProps<{
  src: any;
  id: any;
  title: any;
  album: any;
  subtype: any;
}>();

const source = ref("");
const trackNumber = ref();
const trackTitle = ref("");
const trackAlbum = ref("");
const trackSubtype = ref("");

const { getAccessTokenSilently } = useAuth0();

onMounted(async () => {
  const token = await getAccessTokenSilently();

  source.value = filters.authorizedUrl(props.src, token);
  trackNumber.value = filters.authorizedUrl(props.id, token);
  trackTitle.value = filters.authorizedUrl(props.title, token);
  trackAlbum.value = filters.authorizedUrl(props.album, token);
  trackSubtype.value = filters.authorizedUrl(props.subtype, token);
});
</script>

<template>
  <div class="grid gap-4 grid-cols-3">
    <div class="flex flex-row m-2">
      <img :src="source" class="h-10 aspect-square rounded" />
      <span class="w-full" :number="trackNumber">
        <span :title="trackTitle"></span>
      </span>
    </div>
    <div :subtype="trackSubtype"></div>
    <div>...</div>
  </div>
</template>
