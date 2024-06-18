<script setup lang="ts"></script>

<template>
  <DialogBase
    :show="errorBeingShown !== null && errorBeingShown !== undefined"
    :title="'Error'"
    class="text-center"
    @close="errorHasBeenAcknowledged()"
  >
    {{ errorBeingShown }}
  </DialogBase>
</template>
