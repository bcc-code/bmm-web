<script setup lang="ts">
const { t } = useI18n();
const { $appInsights } = useNuxtApp();

const props = defineProps({
  error: Object,
});

$appInsights.event("error page shown", props.error);

function handleError() {
  clearError();
}
</script>

<template>
  <NuxtLayout>
    <div class="relative grow font-sans">
      <div class="max-w-200 container mx-auto mt-24 px-4 py-10">
        <h1 class="type-display-3">{{ error?.message }}</h1>
        <p class="pt-2">
          That should not have happened. If this keeps happening feel free to
          <a class="underline" href="mailto:bmm-support@bcc.no" target="_blank"
            >contact support</a
          >.
        </p>
        <br />

        <div class="flex gap-2">
          <ButtonStyled intent="primary" @click="handleError">{{
            t("global.try-again")
          }}</ButtonStyled>

          <NuxtLink
            class="type-title-1 rounded-3xl bg-background-2 px-4 py-2"
            to="/"
          >
            Go to homepage
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
