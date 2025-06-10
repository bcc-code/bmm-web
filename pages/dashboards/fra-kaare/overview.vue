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
const church = computed(() => statistics.value?.highlightedChurch);

onBeforeMount(async () => {
  statistics.value = await new StatisticsApi().statisticsFraKaareGet();
});

watch(selectedChurch, async (churchId) => {
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
  <div v-if="statistics">
    <div class="flex items-center gap-4">
      <h2 class="type-heading-1">
        {{ statistics.highlightedChurchName }}
      </h2>
      <div v-if="statistics.availableChurches">
        <DropdownMenu>
          <ButtonStyled size="small" intent="tertiary">
            {{ statistics.highlightedChurchName }}
            <NuxtIcon name="icon.chevron.down" />
          </ButtonStyled>
          <template #items>
            <DropdownMenuGroup>
              <DropdownMenuItem
                v-for="availableChurch in statistics.availableChurches"
                :key="availableChurch.id"
                @click="selectedChurch = availableChurch.id"
              >
                {{ availableChurch.name }}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </template>
        </DropdownMenu>
      </div>
    </div>

    <section
      v-if="statistics.timeSeries || church"
      id="stats"
      class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2"
    >
      <div
        v-if="statistics.timeSeries"
        class="col-span-full min-h-[400px] rounded-2xl bg-background-2 p-8"
      >
        <DashboardTimeSeriesChart :data="statistics.timeSeries" />
      </div>

      <template v-if="church">
        <div
          class="rounded-2xl border border-label-separator bg-background-2 p-8 text-sm"
        >
          <h3 class="type-title-1 mb-4">Hørt minst én episode i prosjektet</h3>
          <div class="flex flex-col divide-y divide-label-separator">
            <div class="flex justify-between py-1">
              <span class="text-label-3">13-17</span>
              <span>{{ percent(church.oneEpisodePercent13To17) }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-label-3">18-25</span>
              <span>{{ percent(church.oneEpisodePercent18To25) }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-label-3">13-25</span>
              <span>{{ percent(church.oneEpisodePercent13To25) }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-label-3">26-35</span>
              <span>{{ percent(church.oneEpisodePercent26To35) }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-label-3">Gjennomsnitt</span>
              <span>{{ percent(church.oneEpisodePercentAverage) }}</span>
            </div>
          </div>
        </div>
        <div
          class="rounded-2xl border border-label-separator bg-background-2 p-8 text-sm"
        >
          <h3 class="type-title-1 mb-4">Totale episoder hørt</h3>
          <div class="flex flex-col divide-y divide-label-separator">
            <div class="flex justify-between py-1">
              <span class="text-label-3">13-17</span>
              <span>{{ percent(church.allEpisodesPercent13To17) }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-label-3">18-25</span>
              <span>{{ percent(church.allEpisodesPercent18To25) }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-label-3">13-25</span>
              <span>{{ percent(church.allEpisodesPercent13To25) }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-label-3">26-35</span>
              <span>{{ percent(church.allEpisodesPercent26To35) }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-label-3">Gjennomsnitt</span>
              <span>{{ percent(church.allEpisodesPercentAverage) }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-label-3">Gutter</span>
              <span>{{ percent(church.allEpisodesPercentBoys) }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-label-3">Jenter</span>
              <span>{{ percent(church.allEpisodesPercentGirls) }}</span>
            </div>
          </div>
        </div>
      </template>
    </section>

    <section id="table" class="my-12">
      <div class="flex items-baseline gap-4">
        <h2 class="type-heading-3">Rangering</h2>
        <div class="mb-4">
          <DropdownMenu placement="bottom-start">
            <ButtonStyled size="small" intent="tertiary">
              {{
                churchSize === "large" ? "Store menigheter" : "Små menigheter"
              }}
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
