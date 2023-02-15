<script setup lang="ts">
import { ref, Ref } from 'vue'
import { AlbumApi, AlbumModel, Configuration } from '../../generated/api/index';

defineProps<{ msg: string }>()

const albums : Ref<AlbumModel[]> = ref([]);

new AlbumApi(new Configuration({
  basePath: "https://int-bmm-api.brunstad.org",
  headers: {
    Authorization: import.meta.env.VITE_BMM_TOKEN,
    "Accept-Language": "en"
  }
})).albumGet().then(list => {
  albums.value = list;
});
const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <ul id="example-1">
    <li v-for="album in albums" :key="album.id">
      {{ album.title }}
    </li>
  </ul>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
