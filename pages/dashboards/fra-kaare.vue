<script setup lang="ts">
import { PersonGenderEnum, StatisticsApi } from "@bcc-code/bmm-sdk-fetch";
import type {
  FraKaareDrawCommandResponse,
  GetFraKaareStatisticsResponse,
} from "@bcc-code/bmm-sdk-fetch";
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
const now = new Date().getFullYear();
const maxBirthYear = ref<number>(now - 13);
const minBirthYear = ref<number>(now - 25);
function resetBirthYear() {
  maxBirthYear.value = now - 13;
  minBirthYear.value = now - 25;
}

const selectedGender = ref<string>("both");
const isLoading = ref<boolean>(false);
const drawResult = ref<FraKaareDrawCommandResponse | null>(null);
async function onDrawWinner() {
  let gender;
  isLoading.value = true;
  if (selectedGender.value === "both") {
    gender = undefined;
  } else if (selectedGender.value === "boys") {
    gender = PersonGenderEnum.Male;
  } else {
    gender = PersonGenderEnum.Female;
  }
  drawResult.value = await new StatisticsApi().statisticsFraKaareDrawPost({
    fraKaareDrawCommand: {
      latestBirthYear: maxBirthYear.value,
      earliestBirthYear: minBirthYear.value,
      gender,
      churchUid: "86cee624-4848-462b-a4bd-8e20f773cb90",
    },
  });
  isLoading.value = false;
}
</script>

<template>
  <div class="space-y-12">
    <PageHeading>Dashboard: Fra Kåre</PageHeading>

    <section>
      <div
        class="mb-5 mt-12 text-[28px] font-extrabold leading-tight text-label-1"
      >
        Draw a winner
      </div>

      <div class="my-4 rounded-b-2xl rounded-t-2xl bg-background-2 p-4">
        <div class="flex items-center gap-2">
          Birth year:
          <input
            type="number"
            v-model.number="maxBirthYear"
            class="type-title-2 w-20 rounded-lg bg-background-1 p-1 px-2 py-1.5 text-label-1 shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
          />
          -

          <input
            type="number"
            v-model.number="minBirthYear"
            class="type-title-2 w-20 rounded-lg bg-background-1 p-1 px-2 py-1.5 text-label-1 shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
          />
          <div>({{ now - maxBirthYear }} - {{ now - minBirthYear }})</div>
          <ButtonStyled
            intent="primary"
            size="small"
            @click.stop="resetBirthYear()"
          >
            13 - 25
          </ButtonStyled>
        </div>
        <div class="flex items-center gap-2 pt-2">
          Gender:

          <div
            class="type-title-2 min-w-[100px] rounded-lg bg-background-1 px-2 py-0 text-label-1 shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
          >
            <select v-model="selectedGender" class="py-1">
              <option
                v-for="(gender, i) in ['both', 'boys', 'girls']"
                :key="`gender${i}`"
                :value="gender"
              >
                {{ gender }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <ButtonStyled intent="primary" @click.stop="onDrawWinner()">
        Draw
      </ButtonStyled>

      <div
        v-if="isLoading || drawResult != null"
        class="my-4 mb-10 rounded-b-2xl rounded-t-2xl bg-background-2 p-4"
      >
        <div v-if="isLoading">Loading...</div>
        <div v-else-if="drawResult != null" class="text-2xl">
          <div>
            {{ drawResult.winnerDisplayName }},
            {{ drawResult.winnerBirthYear }}, {{ drawResult.winnerGender }}
          </div>
        </div>
      </div>

      <div v-if="false">
        <div>Selected birth year: {{ minBirthYear }} - {{ maxBirthYear }}</div>
        <div>Selected gender: {{ selectedGender }}</div>
      </div>
    </section>

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
            text: 'Har hørt minst én episode i 2025',
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
            if (typeof value === 'number') return Math.round(value * 100) + '%';
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
      class="type-paragraph-2 max-w-6xl space-y-3 px-6 text-label-2"
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
