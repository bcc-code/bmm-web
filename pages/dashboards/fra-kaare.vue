<script setup lang="ts">
import { StatisticsApi } from "@bcc-code/bmm-sdk-fetch";
import type { GetFraKaareStatisticsResponse } from "@bcc-code/bmm-sdk-fetch";
import { breakpointsTailwind } from "@vueuse/core";
import DashboardDataTable from "~/components/dashboard/DashboardDataTable.vue";
import type { SortDirection } from "~/components/dashboard/DashboardDataTable.vue";

const { t } = useI18n();
setTitle(() => t("dashboards.title"));

definePageMeta({
  middleware: ["frakaare-dashboard-viewer"],
});

const sortDirection = ref<SortDirection>("descending");
const churchSize = ref<"small" | "large">("large");

const statistics = ref<GetFraKaareStatisticsResponse>();
onBeforeMount(async () => {
  statistics.value = await new StatisticsApi().statisticsFraKaareGet();
});

watch(statistics, (stats) => {
  if (!stats) return;
  churchSize.value = (stats.largeChurches || []).some(
    (item) => item.churchName === stats.highlightedChurchName,
  )
    ? "large"
    : "small";
});

const rows = computed(
  () =>
    (churchSize.value === "large"
      ? statistics.value?.largeChurches
      : statistics.value?.smallChurches) ?? [],
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

function sortStringColumn(
  a: string | null | undefined,
  b: string | null | undefined,
) {
  if (typeof a !== "string" || typeof b !== "string") return 0;
  if (sortDirection.value === "ascending") {
    return b.localeCompare(a);
  }
  return a.localeCompare(b);
}

const breakpoints = useBreakpoints(breakpointsTailwind);
const isSmallScreeen = breakpoints.smaller("lg");

const shouldHideColumns = computed(
  () => churchSize.value === "small" || isSmallScreeen.value,
);
</script>

<template>
  <div class="space-y-12">
    <PageHeading>{{ t("dashboards.fra-kaare.title") }}</PageHeading>

    <section id="graphs"></section>

    <section id="table">
      <div class="mb-4">
        <DropdownMenu placement="bottom-start">
          <ButtonStyled size="small" intent="tertiary">
            {{
              churchSize === "large"
                ? t("dashboards.fra-kaare.largeChurches")
                : t("dashboards.fra-kaare.smallChurches")
            }}
            <NuxtIcon name="icon.chevron.down" class="ml-1" />
          </ButtonStyled>
          <template #items>
            <DropdownMenuGroup>
              <DropdownMenuItem @click="churchSize = 'large'">
                {{ t("dashboards.fra-kaare.largeChurches") }}
              </DropdownMenuItem>
              <DropdownMenuItem @click="churchSize = 'small'">
                {{ t("dashboards.fra-kaare.smallChurches") }}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </template>
        </DropdownMenu>
      </div>

      <DashboardDataTable
        v-if="statistics"
        :key="`${churchSize}-${isSmallScreeen}`"
        v-model:sort-direction="sortDirection"
        :items="rows"
        sort-by="oneEpisodePercentAverage"
        :column-groups="[
          {
            key: 'oneEpisode',
            text: t('dashboards.fra-kaare.oneEpisodeDescription'),
            start: 1,
            span: shouldHideColumns ? 1 : 4,
          },
          {
            key: 'allEpisodes',
            text: t('dashboards.fra-kaare.allEpisodesDescription'),
            start: 5,
            span: shouldHideColumns ? 1 : 4,
          },
        ]"
        :columns="[
          {
            key: 'churchName',
            text: 'Church',
            sortMethod: (a, b) => sortStringColumn(a.churchName, b.churchName),
          },
          {
            key: 'oneEpisodePercent13To17',
            text: '13-17',
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.oneEpisodePercent13To17,
                b.oneEpisodePercent13To17,
              ),
            hide: shouldHideColumns,
          },
          {
            key: 'oneEpisodePercent18To25',
            text: '18-25',
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.oneEpisodePercent18To25,
                b.oneEpisodePercent18To25,
              ),
            hide: shouldHideColumns,
          },
          {
            key: 'oneEpisodePercent26To35',
            text: '26-35',
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.oneEpisodePercent26To35,
                b.oneEpisodePercent26To35,
              ),
            hide: shouldHideColumns,
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
            hide: shouldHideColumns,
          },
          {
            key: 'allEpisodesPercent18To25',
            text: '18-25',
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.allEpisodesPercent18To25,
                b.allEpisodesPercent18To25,
              ),
            hide: shouldHideColumns,
          },
          {
            key: 'allEpisodesPercent26To35',
            text: '26-35',
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.allEpisodesPercent26To35,
                b.allEpisodesPercent26To35,
              ),
            hide: shouldHideColumns,
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
          (item, key) => {
            const value = item[key];
            if (value === null || value === undefined) return '';
            if (typeof value === 'number') return Math.round(value * 100) + '%';
            return value;
          }
        "
        :highlight-row="
          (item) => item.churchName === statistics!.highlightedChurchName
        "
      />
    </section>
  </div>
</template>
