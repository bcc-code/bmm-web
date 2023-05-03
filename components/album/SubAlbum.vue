<script lang="ts" setup>
const props = defineProps<{
  id?: number;
  active: boolean;
}>();

if (!props.id) {
  throw new Error("The sub-album needs an id");
}

const { data: album } = useAlbum({ id: props.id });

const emit = defineEmits(["expand"]);

function expand() {
  emit("expand");
}
</script>

<template>
  <section
    class="group gap-2 relative mr-3 my-4 cursor-pointer"
    :class="
      active
        ? 'p-5 border-2 rounded-3xl active:scale-110 duration-150 shadow-lg'
        : ''
    "
    @click="expand"
  >
    <div
      :class="
        active
          ? ''
          : 'opacity-0 group-hover:opacity-100 absolute -inset-y-2 -inset-x-3 rounded-xl bg-slate-100'
      "
    ></div>
    <section
      v-if="album"
      class="flex gap-2 items-center justify-between relative"
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
    <section
      :class="active ? 'active max-h-fit relative' : 'h-0 overflow-hidden'"
    >
      <div v-for="(track, i) in album?.children" :key="i">
        <p class="p-2 hover:bg-slate-100 rounded-md">
          {{ track.id }}
        </p>
      </div>
    </section>
  </section>
</template>