<script lang="ts" setup>
const props = defineProps<{
  id?: number;
}>();

if (!props.id) {
  throw new Error("The sub-album needs an id");
}

const { data: album } = useAlbum({ id: props.id });
const active = ref(false);

const toggleItem = () => {
  active.value = !active.value;
};
</script>

<template>
  <section
    class="gap-4 py-4 hover:bg-slate-100"
    :class="
      active ? 'p-10 border-2 rounded-3xl active:scale-110 duration-150' : ''
    "
  >
    <section
      v-if="album"
      class="flex gap-4 py-4 items-center justify-between"
      @click="toggleItem"
    >
      <ProtectedImage
        v-if="album.cover"
        :src="album.cover"
        alt=""
        class="rounded-md w-20 aspect-square bg-slate-100"
      />
      <p class="text-2xl font-bold">{{ album.title }}</p>
      <p class="ml-auto">{{ album?.children?.length }} tracks</p>
    </section>
    <section :class="active ? 'active max-h-fit' : 'h-0 overflow-hidden'">
      <div v-for="(track, i) in album?.children" :key="i">
        <p class="p-2">
          {{ track.id }}
        </p>
      </div>
    </section>
  </section>
  <!-- <TrackList :tracks="album.chldren" /> -->
</template>
