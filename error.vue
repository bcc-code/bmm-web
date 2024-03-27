<script setup lang="ts">
defineProps({
  error: Object,
});

function handleError() {
  clearError();
}
</script>

<template>
  <div>
    <NuxtLayout>
      <div class="relative font-sans">
        <div class="max-w-200 container mx-auto px-4 py-10">
          <h1>{{ error?.message }}</h1>
          There was an error 😱

          <br />
          <button @click="handleError">Clear error</button>
          <br />
          <NuxtLink to="/404"> Trigger another error </NuxtLink>
          <br />
          <NuxtLink class="text-primary" to="/"> Navigate home </NuxtLink>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
