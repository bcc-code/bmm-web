<script setup lang="ts">
import { StatisticsApi } from "@bcc-code/bmm-sdk-fetch";
import DashboardDataTable from "~/components/dashboard/DashboardDataTable.vue";
import type { SortDirection } from "~/components/dashboard/DashboardDataTable.vue";

const { t } = useI18n();
setTitle(() => t("dashboards.title"));

const sortDirection = ref<SortDirection>("descending");
const churchSize = ref<"small" | "large">("large");

const api = new StatisticsApi();
const statistics = await api.statisticsFraKaareGet();

const rows = computed(
  () =>
    (churchSize.value === "large"
      ? statistics.largeChurches
      : statistics.smallChurches) ?? [],
);

function sortPercentageColumn(
  a: number | null | undefined,
  b: number | null | undefined,
) {
  if (typeof a !== "number" || typeof b !== "number") return 0;
  const aInt = a * 100;
  const bInt = b * 100;
  if (aInt === bInt) return 0;
  if (sortDirection.value === "descending") {
    return bInt - aInt;
  }
  return aInt - bInt;
}
</script>

<template>
  <div class="space-y-12">
    <PageHeading>{{ t("dashboards.fra-kaare") }}</PageHeading>

    <section id="graphs"></section>

    <section id="table">
      <div class="mb-4">
        <DropdownMenu placement="bottom-start">
          <ButtonStyled size="small" intent="tertiary">
            {{ churchSize === "large" ? "Large churches" : "Small churches" }}
            <NuxtIcon name="icon.chevron.down" class="ml-1" />
          </ButtonStyled>
          <template #items>
            <DropdownMenuGroup>
              <DropdownMenuItem @click="churchSize = 'large'">
                Large churches
              </DropdownMenuItem>
              <DropdownMenuItem @click="churchSize = 'small'">
                Small churches
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </template>
        </DropdownMenu>
      </div>

      <DashboardDataTable
        :key="churchSize"
        v-model:sort-direction="sortDirection"
        :items="rows"
        sort-by="oneEpisodePercentAverage"
        :column-groups="[
          {
            key: 'oneEpisode',
            text: 'Listened to at least one episode',
            start: 1,
            span: 4,
          },
          {
            key: 'allEpisodes',
            text: 'Listened to every episode',
            start: 5,
            span: 4,
          },
        ]"
        :columns="[
          {
            key: 'churchName',
            text: 'Church',
            sortMethod(a, b) {
              if (!a.churchName || !b.churchName) return 0;
              if (sortDirection === 'ascending') {
                return b.churchName.localeCompare(a.churchName);
              }
              return a.churchName.localeCompare(b.churchName);
            },
          },
          {
            key: 'oneEpisodePercent13To17',
            text: '13-17',
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.oneEpisodePercent13To17,
                b.oneEpisodePercent13To17,
              ),
          },
          {
            key: 'oneEpisodePercent18To25',
            text: '18-25',
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.oneEpisodePercent18To25,
                b.oneEpisodePercent18To25,
              ),
          },
          {
            key: 'oneEpisodePercent26To35',
            text: '26-35',
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.oneEpisodePercent26To35,
                b.oneEpisodePercent26To35,
              ),
          },
          {
            key: 'oneEpisodePercentAverage',
            text: 'Average',
            props: { class: 'bg-background-2' },
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.oneEpisodePercentAverage,
                b.oneEpisodePercentAverage,
              ),
          },
          {
            key: 'allEpisodesPercent13To17',
            text: '13-17',
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.allEpisodesPercent13To17,
                b.allEpisodesPercent13To17,
              ),
          },
          {
            key: 'allEpisodesPercent18To25',
            text: '18-25',
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.allEpisodesPercent18To25,
                b.allEpisodesPercent18To25,
              ),
          },
          {
            key: 'allEpisodesPercent26To35',
            text: '26-35',
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.allEpisodesPercent26To35,
                b.allEpisodesPercent26To35,
              ),
          },
          {
            key: 'allEpisodesPercentAverage',
            text: 'Average',
            props: { class: 'bg-background-2' },
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.allEpisodesPercentAverage,
                b.allEpisodesPercentAverage,
              ),
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
        :highlight-row="
          (item) => item.churchName === statistics.highlightedChurchName
        "
      />
    </section>
  </div>
</template>
