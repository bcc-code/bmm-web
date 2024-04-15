<script setup lang="ts">
defineProps<{
  show: boolean;
}>();
defineEmits<{
  close: [];
}>();

const runtimeConfig = useRuntimeConfig();
const email = runtimeConfig.public.mediaSupportEmail;
</script>

<template>
  <DialogBase
    :show="show"
    :title="$t('download.download-track')"
    class="text-center"
    @close="$emit('close')"
  >
    <div class="flex max-w-xl flex-col items-center justify-center">
      <NuxtIcon name="download" class="mt-5 text-center text-5xl" />
      <h3 class="my-3 text-2xl font-extrabold leading-tight text-label-1">
        {{ $t("download.messages-not-allowed.title") }}
      </h3>

      <p class="px-10 text-label-2">
        {{ $t("download.messages-not-allowed.description") }}
      </p>
      <TooltipBase placement="top" :offset="8" class="mb-3 mt-5">
        <a :href="`mailto:${email}`">
          <ButtonStyled intent="primary">
            {{ $t("profile.contact") }}
          </ButtonStyled>
        </a>
        <template #content>
          <div class="rounded-2xl bg-background-1 px-5 py-3 shadow-md">
            <p class="text-sm text-label-2">
              {{ $t("download.sendEmailTo", [email]) }}
            </p>
          </div>
        </template>
      </TooltipBase>
    </div>
  </DialogBase>
</template>
