<script setup lang="ts">
import { StatisticsApi } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
setTitle(() => t("dashboards.title"));

const api = new StatisticsApi();
const statistics = await api.statisticsFraKaareGet();

const rows = statistics.largeChurches ?? [];

// const thirteenAvg = computed(
//   () => rows.reduce((a, b) => a + b., 0) / rows.length,
// );
</script>

<template>
  <div class="space-y-12">
    <PageHeading>{{ t("dashboards.fra-kaare") }}</PageHeading>
    <section id="graphs"></section>
    <section id="table">
      <DataTable
        :items="rows"
        :columns="[
          {
            key: 'churchName',
            text: 'Church',
          },
          {
            key: 'oneEpisodePercent13To17',
            text: '13-17',
          },
          {
            key: 'oneEpisodePercent18To25',
            text: '18-25',
          },
          {
            key: 'oneEpisodePercent26To35',
            text: '26-35',
          },
          {
            key: 'oneEpisodePercentAverage',
            text: 'Average',
          },
          {
            key: 'allEpisodesPercent13To17',
            text: '13-17',
          },
          {
            key: 'allEpisodesPercent18To25',
            text: '18-25',
          },
          {
            key: 'allEpisodesPercent26To35',
            text: '26-35',
          },
          {
            key: 'allEpisodesPercentAverage',
            text: 'Average',
          },
        ]"
        :get-field="
          (item, key) =>
            typeof item[key] === 'number'
              ? `${Math.round(item[key] * 100)}%`
              : item[key]
                ? item[key].toString()
                : ''
        "
      />
    </section>
  </div>
</template>
