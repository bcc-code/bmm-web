<script lang="ts" setup>
import { TrackCollectionApi } from "@bcc-code/bmm-sdk-fetch";
import type { TrackCollectionIdPostRequest } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();

const props = defineProps<{
  trackId: number;
}>();
const emit = defineEmits<{
  close: [];
}>();

const { data: playlists } = usePrivatePlaylists();
const selectedPlaylistId = ref(0);
const idsToLink = (...ids: number[]) => ids.map((id) => `</track/${id}>,`);

const selectList = (playlistId: number) => {
  selectedPlaylistId.value = playlistId;
  const options: TrackCollectionIdPostRequest = {
    id: playlistId,
    link: idsToLink(props.trackId),
  };
  new TrackCollectionApi().trackCollectionIdPost(options);
  emit("close");
};
</script>

<template>
  <DialogBase
    :show="true"
    :title="t('track.dropdown.add-to-playlist')"
    @close="emit('close')"
  >
    <div class="bg-background-2 rounded-lg">
      <div
        v-for="collection in playlists"
        :key="collection.id"
        class="text-label-1 flex flow-row gap-3 p-2 px-5"
        @class="
          selectedPlaylistId == collection.id
            ? ' text-label-1 bg-background-4'
            : ''
        "
        @click="selectList(collection.id)"
      >
        <NuxtIcon name="icon.category.playlist"></NuxtIcon>
        {{ collection.name }}
        <div
          v-if="selectedPlaylistId == collection.id"
          class="bg-background-4 rounded-full w-6 h-6 ml-auto"
        >
          <NuxtIcon name="icon.checkmark" class="text-on-color-1 text-2xl" />
        </div>
      </div>
    </div>
  </DialogBase>
</template>
