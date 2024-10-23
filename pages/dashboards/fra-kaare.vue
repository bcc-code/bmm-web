<script setup lang="ts">
import { StatisticsApi } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
setTitle(() => t("dashboards.title"));

const api = new StatisticsApi();
const statistics = await api.statisticsFraKaareGet();

const rows = statistics.list ?? [];

// const thirteenAvg = computed(
//   () => rows.reduce((a, b) => a + b., 0) / rows.length,
// );
</script>

<template>
  <div class="space-y-12">
    <PageHeading>{{ t("dashboards.fra-kaare") }}</PageHeading>
    <section
      id="stats"
      class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 sm:gap-6"
    >
      <DashboardStatistic label="Average 13-17" :value="80">
        <template #value="{ value }"> {{ value.toFixed(1) }}%</template>
      </DashboardStatistic>
      <DashboardStatistic label="Average 18-25" :value="85">
        <template #value="{ value }"> {{ value.toFixed(1) }}%</template>
      </DashboardStatistic>
      <DashboardStatistic label="Average 26-36" :value="87">
        <template #value="{ value }"> {{ value.toFixed(1) }}%</template>
      </DashboardStatistic>
    </section>
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
            key: 'oneEpisodePercent13to17',
            text: '13-17',
          },
          {
            key: 'oneEpisodePercent18to25',
            text: '18-25',
          },
          {
            key: 'oneEpisodePercent26to35',
            text: '26-36',
          },
          {
            key: 'oneEpisodePercentYouth',
            text: 'Average',
          },
          {
            key: 'onTrackPercent13to17',
            text: '13-17',
          },
          {
            key: 'onTrackPercent18to25',
            text: '18-25',
          },
          {
            key: 'onTrackPercent26to35',
            text: '26-36',
          },
          {
            key: 'onTrackPercentYouth',
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
