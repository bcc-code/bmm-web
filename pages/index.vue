<script lang="ts" setup>
const { t } = useI18n();
setTitle(() => t("nav.home"));

const { data: models, pending } = useDiscover({});
</script>

<template>
  <DocumentList
    :items="models"
    :pending="pending"
    class="mt-6 lg:mt-12"
    show-message-to-mobile-users
    origin="ExploreNewest"
  ></DocumentList>
</template>
