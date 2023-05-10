<script lang="ts" setup>
const props = defineProps<{
  id: number;
  active: boolean;
}>();

const { data: album } = useAlbum({ id: props.id });

const emit = defineEmits(["expand"]);

function expand() {
  emit("expand");
}
</script>

<template>
  <section
    class="group relative my-4 mr-3 cursor-pointer gap-2"
    :class="
      active
        ? 'rounded-3xl border-2 p-5 shadow-lg duration-150 active:scale-110'
        : ''
    "
    @click="expand"
  >
    <div
      :class="
        active
          ? ''
          : 'bg-slate-100 absolute -inset-x-3 -inset-y-2 rounded-xl opacity-0 group-hover:opacity-100'
      "
    ></div>
    <section
      v-if="album"
      class="relative flex items-center justify-between gap-2"
    >
      <ProtectedImage
        v-if="album.cover"
        :src="album.cover"
        alt=""
        class="bg-slate-100 aspect-square w-20 rounded-md"
      />
      <p class="text-2xl font-bold">{{ album.title }}</p>
      <p class="ml-auto">{{ album?.children?.length }} tracks</p>
    </section>
    <section
      :class="active ? 'active relative max-h-fit' : 'h-0 overflow-hidden'"
    >
      <div v-for="(track, i) in album?.children" :key="i">
        <p class="hover:bg-slate-100 rounded-md p-2">
          {{ track.id }}
        </p>
      </div>
    </section>
  </section>
</template>
