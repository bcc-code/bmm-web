<script setup lang="ts">
const { year } = useRoute<"archive-year">().params;

toolbarTitleStore().setReactiveToolbarTitle(() => year);

const { data: years, pending } = useAlbumsInYear(parseInt(year, 10));
</script>
<template>
  <div>
    <DocumentList :items="years" :pending="pending" />
  </div>
</template>
