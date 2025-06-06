<script setup lang="ts">
import { StatisticsApi } from "@bcc-code/bmm-sdk-fetch";
import type {
  FraKaareDrawCommandDrawOption,
  GetFraKaareStatisticsResponse,
} from "@bcc-code/bmm-sdk-fetch";
import { breakpointsTailwind } from "@vueuse/core";
import DashboardDataTable from "~/components/dashboard/DashboardDataTable.vue";
import type { SortDirection } from "~/components/dashboard/DashboardDataTable.vue";

const { t } = useI18n();
setTitle(() => t("dashboards.title"));

const sortDirection = ref<SortDirection>("descending");
const churchSize = ref<"small" | "large">("large");
const selectedChurch = ref<string | null | undefined>(null);

const statistics = ref<GetFraKaareStatisticsResponse>();
function church() {
  return statistics.value?.highlightedChurch;
}
onBeforeMount(async () => {
  statistics.value = await new StatisticsApi().statisticsFraKaareGet();
});

watch(selectedChurch, async (churchId) => {
  console.log("Selected church:", churchId);
  statistics.value = await new StatisticsApi().statisticsFraKaareGet({
    church: churchId ?? undefined,
  });
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
  if (a === b) return 0;
  if (sortDirection.value === "descending") {
    return b - a;
  }
  return a - b;
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

function percent(value: number | undefined) {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return `${Math.round(value * 100)}%`;
  return value;
}

const breakpoints = useBreakpoints(breakpointsTailwind);
const isSmallScreeen = breakpoints.smaller("lg");

const shouldHideColumns = computed(
  () => churchSize.value === "small" || isSmallScreeen.value,
);

const columnGroupWidth = computed(() => {
  if (churchSize.value === "small" && !isSmallScreeen.value) return 2;
  if (shouldHideColumns.value) return 1;
  return 5;
});

const selectedDrawOption = ref<FraKaareDrawCommandDrawOption>();
watch(statistics, (stats) => {
  if (!stats) return;
  selectedDrawOption.value = stats.drawOptions?.[0];
});
</script>

<template>
  <div class="space-y-12">
    <div v-if="statistics?.availableChurches">
      <DropdownMenu placement="bottom-start">
        <ButtonStyled size="small" intent="tertiary">
          {{ statistics?.highlightedChurchName }}
          <NuxtIcon name="icon.chevron.down" class="ml-1" />
        </ButtonStyled>
        <template #items>
          <DropdownMenuGroup>
            <DropdownMenuItem
              v-for="church in statistics.availableChurches"
              :key="church.id"
              @click="selectedChurch = church.id"
            >
              {{ church.name }}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </template>
      </DropdownMenu>
    </div>

    <section
      id="chart"
      class="flex min-h-[400px] flex-col rounded-2xl bg-background-2 p-8"
    >
      <h2 class="type-heading-3 mb-4">
        {{ statistics?.highlightedChurchName }}
      </h2>
      <DashboardTimeSeriesChart
        v-if="statistics?.timeSeries"
        :data="statistics.timeSeries"
      />
    </section>

    <section id="table">
      <div class="mb-4">
        <DropdownMenu placement="bottom-start">
          <ButtonStyled size="small" intent="tertiary">
            {{ churchSize === "large" ? "Store menigheter" : "Små menigheter" }}
            <NuxtIcon name="icon.chevron.down" class="ml-1" />
          </ButtonStyled>
          <template #items>
            <DropdownMenuGroup>
              <DropdownMenuItem @click="churchSize = 'large'">
                Store menigheter
              </DropdownMenuItem>
              <DropdownMenuItem @click="churchSize = 'small'">
                Små menigheter
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
            text: 'Har hørt minst én episode fra «Tjen Gud av hele ditt hjerte»',
            start: 1,
            span: columnGroupWidth,
          },
          {
            key: 'allEpisodes',
            text: 'Totale episoder hørt',
            start: 5,
            span: columnGroupWidth,
          },
        ]"
        :columns="[
          {
            key: 'churchName',
            text: 'Menighet',
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
            text: 'Gjennomsnitt',
            props: () =>
              !shouldHideColumns ? { class: 'bg-background-2' } : {},
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.oneEpisodePercentAverage,
                b.oneEpisodePercentAverage,
              ),
          },
          {
            key: 'oneEpisodeChange',
            text: 'Endring 7d',
            props: (item) => ({
              class: [
                'bg-background-2',
                {
                  'text-[green]':
                    item?.oneEpisodeChange && item.oneEpisodeChange > 0,
                  'text-[red]':
                    item?.oneEpisodeChange && item.oneEpisodeChange < 0,
                },
              ],
            }),
            sortMethod: (a, b) =>
              sortPercentageColumn(a.oneEpisodeChange, b.oneEpisodeChange),
            hide: isSmallScreeen,
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
            text: 'Gjennomsnitt',
            props: () =>
              !shouldHideColumns ? { class: 'bg-background-2' } : {},
            sortMethod: (a, b) =>
              sortPercentageColumn(
                a.allEpisodesPercentAverage,
                b.allEpisodesPercentAverage,
              ),
          },
          {
            key: 'allEpisodesChange',
            text: 'Endring 7d',
            props: (item) => ({
              class: [
                'bg-background-2',
                {
                  'text-[green]':
                    item?.allEpisodesChange && item.allEpisodesChange > 0,
                  'text-[red]':
                    item?.allEpisodesChange && item.allEpisodesChange < 0,
                },
              ],
            }),
            sortMethod: (a, b) =>
              sortPercentageColumn(a.allEpisodesChange, b.allEpisodesChange),
            hide: isSmallScreeen,
          },
        ]"
        :get-field="
          (item, key) => {
            const value = item[key];
            if (value === null || value === undefined) return '';
            if (typeof value === 'number') return percent(value);
            return value;
          }
        "
        :highlight-row="
          (item) => item.churchName === statistics!.highlightedChurchName
        "
      >
        <template #oneEpisodeChange="{ item }">
          <div
            v-if="typeof item.oneEpisodeChange === 'number'"
            class="flex grow items-center justify-end gap-1"
          >
            <NuxtIcon
              v-if="item.oneEpisodeChange !== 0"
              :name="
                item.oneEpisodeChange > 0
                  ? 'icon.chevron.up'
                  : 'icon.chevron.down'
              "
            />
            <span>{{ (item.oneEpisodeChange * 100).toFixed(1) }}%</span>
          </div>
        </template>
        <template #allEpisodesChange="{ item }">
          <div
            v-if="typeof item.allEpisodesChange === 'number'"
            class="flex grow items-center justify-end gap-1"
          >
            <NuxtIcon
              v-if="item.allEpisodesChange !== 0"
              :name="
                item.allEpisodesChange > 0
                  ? 'icon.chevron.up'
                  : 'icon.chevron.down'
              "
            />
            <span>{{ (item.allEpisodesChange * 100).toFixed(1) }}%</span>
          </div>
        </template>
      </DashboardDataTable>
    </section>

    <section v-if="church()">
      <h2 class="type-heading-3 mb-4">
        {{ statistics?.highlightedChurchName }}
      </h2>
      <div class="flex gap-4">
        <fieldset
          class="rounded-2xl border border-label-separator bg-background-2 p-3"
        >
          <legend class="type-title-3 px-1">
            Hørt minst én episode i prosjektet
          </legend>
          <div>13-17: {{ percent(church()?.oneEpisodePercent13To17) }}</div>
          <div>18-25: {{ percent(church()?.oneEpisodePercent18To25) }}</div>
          <div>13-25: {{ percent(church()?.oneEpisodePercent13To25) }}</div>
          <div>26-35: {{ percent(church()?.oneEpisodePercent26To35) }}</div>
          <div>
            Gjennomsnitt: {{ percent(church()?.oneEpisodePercentAverage) }}
          </div>
        </fieldset>
        <fieldset
          class="rounded-2xl border border-label-separator bg-background-2 p-3"
        >
          <legend class="type-title-3 px-1">Totale episoder hørt</legend>
          <div>13-17: {{ percent(church()?.allEpisodesPercent13To17) }}</div>
          <div>18-25: {{ percent(church()?.allEpisodesPercent18To25) }}</div>
          <div>13-25: {{ percent(church()?.allEpisodesPercent13To25) }}</div>
          <div>26-35: {{ percent(church()?.allEpisodesPercent26To35) }}</div>
          <div>
            Gjennomsnitt: {{ percent(church()?.allEpisodesPercentAverage) }}
          </div>
          <div>Boys: {{ percent(church()?.allEpisodesPercentBoys) }}</div>
          <div>Girls: {{ percent(church()?.allEpisodesPercentGirls) }}</div>
        </fieldset>
      </div>
    </section>

    <section
      id="info"
      class="type-paragraph-2 max-w-6xl space-y-3 text-label-2"
    >
      <p>
        Tilgangen til denne statistikken er kun ment for lokale ungdomsledere og
        BUK-kontakter. Disse dataene inneholder informasjon om individuell
        deltagelse i bibelstudieprosjektet, og det er derfor viktig at de ikke
        deles fritt med andre. Bruk denne statistikken ansvarlig for å skape
        positivt engasjement rundt prosjektet i din lokalforening. Dersom du har
        spørsmål til hvordan tallene kan brukes, vennligst kontakt oss på
        <a href="mailto:support@bcc.media" class="underline"
          >support@bcc.media</a
        >.
      </p>
      <p>
        Alderskategoriene er basert på alderen i begynnelsen av året. Det betyr
        at hvis du fyller 18 i år, regnes du med i kategorien 13-17.
        Alderskategoriene er basert på personlige brukerkontoer, og brukere som
        f.eks. låner foreldres innlogging vil ikke telle med i statistikken for
        sin aldersgruppe.
      </p>
    </section>
  </div>
</template>
