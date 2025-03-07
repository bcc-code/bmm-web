<script setup lang="ts">
import type { GetFraKaareStatisticsChurchStatisticsSnapshot } from "@bcc-code/bmm-sdk-fetch";
import {
  VisAxis,
  VisLine,
  VisXYContainer,
  VisCrosshair,
  VisTooltip,
  VisBulletLegend,
} from "@unovis/vue";

defineProps<{
  data: GetFraKaareStatisticsChurchStatisticsSnapshot[];
}>();

const getColor = (index: number) => `var(--vis-color${index})`;

const crosshairTemplate = (d: GetFraKaareStatisticsChurchStatisticsSnapshot) =>
  `<div class="flex flex-col gap-2">
		<p class="type-title-3 leading-none mb-1 text-label-3">${d.snapshotDate?.toLocaleDateString()}</p>
		<p class="type-title-2 leading-none pl-2 border-l-4 border-[var(--vis-color0)]">${Math.round((d.allEpisodesPercentAverage ?? 0) * 100)}%</p>
		<p class="type-title-2 leading-none pl-2 border-l-4 border-[var(--vis-color1)]">${Math.round((d.oneEpisodePercentAverage ?? 0) * 100)}%</p>
	</div>`;
</script>

<template>
  <VisBulletLegend
    :items="[
      { name: 'Totale episoder hørt', color: getColor(0) },
      { name: 'Har hørt minst én episode i prosjektet', color: getColor(1) },
    ]"
  />
  <VisXYContainer :data="data" class="grow">
    <VisLine
      :x="(d: GetFraKaareStatisticsChurchStatisticsSnapshot) => d.snapshotDate"
      :y="
        (d: GetFraKaareStatisticsChurchStatisticsSnapshot) =>
          d.allEpisodesPercentAverage
      "
      :color="getColor(0)"
    />
    <VisLine
      :x="(d: GetFraKaareStatisticsChurchStatisticsSnapshot) => d.snapshotDate"
      :y="
        (d: GetFraKaareStatisticsChurchStatisticsSnapshot) =>
          d.oneEpisodePercentAverage
      "
      :color="getColor(1)"
    />
    <VisAxis
      type="x"
      :grid-line="false"
      :tick-line="false"
      :tick-format="
        (timestamp: number) => new Date(timestamp).toLocaleDateString()
      "
    />
    <VisAxis
      type="y"
      :tick-line="false"
      :tick-format="(v: number) => `${v * 100}%`"
    />
    <VisCrosshair :template="crosshairTemplate" />
    <VisTooltip />
  </VisXYContainer>
</template>

<style>
:root {
  --vis-tooltip-background-color: var(--bmm-background-1);
  --vis-tooltip-border-color: var(--bmm-label-separator);
  --vis-tooltip-text-color: var(--bmm-label-1);
  --vis-tooltip-padding: 12px;
  --vis-tooltip-border-radius: 8px;
}
</style>
