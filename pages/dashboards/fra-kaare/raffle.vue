<script setup lang="ts">
import { PersonGenderEnum, StatisticsApi } from "@bcc-code/bmm-sdk-fetch";
import type {
  FraKaareDrawCommandDrawOption,
  FraKaareDrawCommandResponse,
  GetFraKaareStatisticsResponse,
} from "@bcc-code/bmm-sdk-fetch";
import { vConfetti } from "@neoconfetti/vue";

const statistics = ref<GetFraKaareStatisticsResponse>();
onBeforeMount(async () => {
  statistics.value = await new StatisticsApi().statisticsFraKaareGet();
});

const { t } = useI18n();
setTitle(() => t("dashboards.title"));

const now = new Date().getFullYear();
const minAge = ref<number>(12);
const maxAge = ref<number>(25);
watch([minAge, maxAge], ([min, max], [oldMin, oldMax]) => {
  if (min !== oldMin) {
    if (min > maxAge.value) {
      maxAge.value = min;
    }
    if (min < 12) {
      minAge.value = 12;
    }
  }
  if (max !== oldMax) {
    if (max < minAge.value) {
      minAge.value = max;
    }
    if (max > 37) {
      maxAge.value = 37;
    }
  }
});

const genders = ["both", "boys", "girls"] as const;
type Gender = (typeof genders)[number];
const selectedGender = ref<Gender>("both");
const genderTranslations: Record<Gender, string> = {
  both: "Begge",
  boys: "Gutter",
  girls: "Jenter",
};
const selectedDrawOption = ref<FraKaareDrawCommandDrawOption>();
watch(statistics, (stats) => {
  if (!stats) return;
  selectedDrawOption.value = stats.drawOptions?.[0];
});
const isLoading = ref(false);
const drawResult = ref<FraKaareDrawCommandResponse | null>(null);
async function onDrawWinner() {
  isLoading.value = true;
  let gender;

  if (selectedGender.value === "both") {
    gender = undefined;
  } else if (selectedGender.value === "boys") {
    gender = PersonGenderEnum.Male;
  } else {
    gender = PersonGenderEnum.Female;
  }

  try {
    if (!selectedDrawOption.value) return;
    drawResult.value = await new StatisticsApi().statisticsFraKaareDrawPost({
      fraKaareDrawCommand: {
        latestBirthYear: now - minAge.value - 1,
        earliestBirthYear: now - maxAge.value - 1,
        gender,
        drawOptionId: selectedDrawOption.value.id,
      },
    });
  } catch (e) {
    showErrorToUser("DrawWinnerFailed", "Kunne ikke trekke vinner");
  }
  isLoading.value = false;
}
</script>

<template>
  <div class="space-y-12">
    <section
      id="raffle"
      class="grid grid-cols-1 grid-rows-[2fr_1fr] overflow-hidden rounded-2xl border border-label-separator xl:grid-cols-2 xl:grid-rows-1"
    >
      <div class="flex flex-col gap-4 bg-background-2 p-6">
        <div class="mb-2 flex flex-wrap items-center justify-between gap-4">
          <h2 class="type-heading-3">Trekk en vinner</h2>
          <TooltipBase :delay="500">
            <div class="flex gap-2">
              <div
                v-for="i in statistics?.maxDraws"
                :key="i"
                :class="[
                  'size-3 rounded-full border border-background-4',
                  i <= (drawResult?.drawsLeft ?? statistics?.drawsLeft ?? 0)
                    ? 'bg-background-4'
                    : '',
                ]"
              />
            </div>

            <template #content>
              <p
                class="type-paragraph-3 mt-2 rounded-xl border border-label-separator bg-background-1 px-4 py-2 shadow-lg"
              >
                Du kan trekke {{ statistics?.maxDraws }} vinnere per uke.
              </p>
            </template>
          </TooltipBase>
        </div>

        <fieldset
          class="flex w-full flex-wrap items-start justify-between gap-4 rounded-2xl border border-label-separator bg-background-2 p-3"
        >
          <legend class="type-title-3 bg-background-2 px-1">
            Aldersgruppe
          </legend>
          <div class="items-center gap-x-2 gap-y-1">
            <div class="flex items-center gap-2 pb-2">
              <input
                :value="minAge"
                @change="
                  (e) =>
                    (minAge = parseInt((e.target as HTMLInputElement).value))
                "
                type="number"
                class="type-title-2 w-20 rounded-lg bg-background-1 px-2 py-1.5 text-label-1"
              />
              -
              <input
                :value="maxAge"
                @change="
                  (e) =>
                    (maxAge = parseInt((e.target as HTMLInputElement).value))
                "
                type="number"
                class="type-title-2 w-20 rounded-lg bg-background-1 px-2 py-1.5 text-label-1"
              />
            </div>
            <p class="type-paragraph-3 block px-2 text-label-3">
              Født mellom {{ now - maxAge - 1 }} og {{ now - minAge - 1 }}
            </p>
          </div>
          <div class="flex flex-wrap justify-end gap-2">
            <button
              class="type-paragraph-3 shrink-0 rounded-lg bg-background-3 px-3 py-0.5 text-label-3 active:bg-background-2"
              @click.stop="
                {
                  minAge = 12;
                  maxAge = 25;
                }
              "
            >
              Sett til 12 - 25
            </button>
            <button
              class="type-paragraph-3 shrink-0 rounded-lg bg-background-3 px-3 py-0.5 text-label-3 active:bg-background-2"
              @click.stop="
                {
                  minAge = 12;
                  maxAge = 35;
                }
              "
            >
              Sett til 12 - 35
            </button>
          </div>
        </fieldset>

        <fieldset
          class="flex w-full items-start justify-between gap-4 rounded-2xl border border-label-separator bg-background-2 p-3"
        >
          <legend class="type-title-3 bg-background-2 px-1">Kjønn</legend>
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

        <fieldset
          v-if="statistics?.drawOptions"
          class="flex w-full items-start justify-between gap-4 rounded-2xl border border-label-separator bg-background-2 p-3"
        >
          <legend class="type-title-3 bg-background-2 px-1">
            Har hørt på alle episoder i perioden
          </legend>
          <select
            v-model="selectedDrawOption"
            class="type-title-2 w-full truncate rounded-lg bg-background-1 px-2 py-1.5 text-label-1"
          >
            <option
              v-for="(option, index) in statistics.drawOptions"
              :key="option.id ?? index"
              :value="option"
            >
              {{ option.description }}
            </option>
          </select>
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

      <div
        :key="JSON.stringify(drawResult)"
        class="flex items-center justify-center p-6 text-center"
      >
        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 scale-90"
          enter-to-class="opacity-100 scale-100"
        >
          <div v-if="drawResult?.isSuccess">
            <p class="type-display-3">
              {{ drawResult.winnerDisplayName }}
            </p>
            <div v-confetti="{ particleCount: 50, force: 0.5 }" />
          </div>
          <div v-else-if="drawResult?.errorMessage">
            <p class="type-paragraph-1">
              {{ drawResult.errorMessage }}
            </p>
          </div>
        </Transition>
      </div>
    </section>

    <section
      id="info"
      class="type-paragraph-2 max-w-4xl space-y-4 px-6 text-label-2"
    >
      <p>
        Her kan du trekke en person som har hørt alle episoder i en gitt
        periode. Dette er ikke basert på streak poeng, men om en har hørt på
        alle episodene, uavhengig av om man gjorde det innnen tiden. Tanken med
        dette verktøyet er å gjøre det enklere å motivere ungdomsflokken, men vi
        ønsker ikke å erstatte eksisterende løsninger som allerede brukes i din
        lokalmenighet.
      </p>
      <p>
        Det kan gjøres 10 trekninger per uke og det tilbakestilles hver mandag.
        Det må finnes minst 20 personer i den valgte målgruppen for at
        trekningen blir gjennomført. For den valgte perioden og dets kriterier
        må det finnes minst 3 personer som har hørt alle episoder, og som derfor
        har muligheten til å vinne.
      </p>
    </section>
  </div>
</template>
