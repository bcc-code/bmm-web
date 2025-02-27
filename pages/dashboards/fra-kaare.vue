<script setup lang="ts">
import { PersonGenderEnum, StatisticsApi } from "@bcc-code/bmm-sdk-fetch";
import type {
  FraKaareDrawCommandResponse,
  GetFraKaareStatisticsResponse,
} from "@bcc-code/bmm-sdk-fetch";
import { breakpointsTailwind } from "@vueuse/core";
import DashboardDataTable from "~/components/dashboard/DashboardDataTable.vue";
import type { SortDirection } from "~/components/dashboard/DashboardDataTable.vue";
import { vConfetti } from "@neoconfetti/vue";

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
const minAge = ref<number>(13);
const maxAge = ref<number>(25);
function resetAge() {
  minAge.value = 13;
  maxAge.value = 25;
}

const genders = ["both", "boys", "girls"] as const;
type Gender = (typeof genders)[number];
const selectedGender = ref<Gender>("both");
const genderTranslations: Record<Gender, string> = {
  both: "Begge",
  boys: "Gutter",
  girls: "Jenter",
};
const isLoading = ref(false);
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
      latestBirthYear: now - minAge.value,
      earliestBirthYear: now - maxAge.value,
      gender,
    },
  });
  isLoading.value = false;
}
</script>

<template>
  <div class="space-y-12">
    <PageHeading>Dashboard: Fra Kåre</PageHeading>

    <section
      id="raffle"
      class="grid grid-rows-[2fr_1fr] overflow-hidden rounded-2xl border border-label-separator xl:grid-cols-2 xl:grid-rows-1"
    >
      <div class="flex flex-col gap-4 bg-background-2 p-6">
        <h2 class="type-heading-3">Trekk en vinner</h2>

        <fieldset
          class="flex w-full items-start justify-between gap-4 rounded-2xl border border-label-separator bg-background-2 p-3"
        >
          <legend class="bg-background-2 px-1">Aldersgruppe</legend>
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <input
              v-model.number="minAge"
              type="number"
              class="type-title-2 w-20 rounded-lg bg-background-1 px-2 py-1.5 text-label-1"
            />
            -
            <input
              v-model.number="maxAge"
              type="number"
              class="type-title-2 w-20 rounded-lg bg-background-1 px-2 py-1.5 text-label-1"
            />
            <span class="type-paragraph-3 w-full px-2 text-label-3">
              Født mellom {{ now - maxAge }} og {{ now - minAge }}
            </span>
          </div>
          <button
            class="type-paragraph-3 shrink-0 rounded-lg bg-background-3 px-3 py-0.5 text-label-3"
            @click.stop="resetAge()"
          >
            Sett til 13 - 25
          </button>
        </fieldset>

        <fieldset
          class="flex w-full items-start justify-between gap-4 rounded-2xl border border-label-separator bg-background-2 p-3"
        >
          <legend>Kjønn</legend>
          <div class="flex rounded-xl bg-background-1 p-1">
            <button
              v-for="gender in genders"
              :key="gender"
              :class="[
                'type-title-3 rounded-lg border px-3 py-1',
                selectedGender === gender
                  ? 'border-label-separator bg-background-2 shadow-sm'
                  : 'border-[transparent]',
              ]"
              @click.stop="selectedGender = gender"
            >
              <span>{{ genderTranslations[gender] }}</span>
            </button>
          </div>
        </fieldset>

        <ButtonStyled
          intent="primary"
          class="mt-2"
          :loading="isLoading"
          @click.stop="onDrawWinner"
        >
          Trekk vinner
        </ButtonStyled>
      </div>

      <div class="flex items-center justify-center p-6">
        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 scale-90"
          enter-to-class="opacity-100 scale-100"
        >
          <div v-if="drawResult != null">
            <p class="type-display-3">
              {{ drawResult.winnerDisplayName }}
            </p>
            <div v-confetti="{ particleCount: 50, force: 0.5 }" />
          </div>
        </Transition>
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
