<script setup lang="ts">
import { NuxtLink } from "#components";
</script>

<template>
  <div>
    <header class="mb-8">
      <PageHeading>Dashboard: Fra Kåre</PageHeading>
      <div class="flex border-b border-label-separator">
        <NuxtLink
          to="/dashboards/fra-kaare/overview"
          class="px-4 py-2"
          active-class="border-b-4 border-tint"
        >
          Statistikk
        </NuxtLink>
        <NuxtLink
          to="/dashboards/fra-kaare/raffle"
          class="px-4 py-2"
          active-class="border-b-4 border-tint"
        >
          Trekk en vinner
        </NuxtLink>
      </div>
    </header>
    <NuxtPage />
  </div>
</template>
