<script setup lang="ts">
const { t } = useI18n();
setTitle(() => t("dashboards.title"));

const rows = [
  {
    id: 1,
    church: "Mallorca",
    thirteen: 57,
    eighteen: 23,
    twentysix: 78,
  },
  { id: 2, church: "Para", thirteen: 82, eighteen: 67, twentysix: 44 },
  { id: 3, church: "Lahti", thirteen: 34, eighteen: 59, twentysix: 72 },
  { id: 4, church: "Paris", thirteen: 91, eighteen: 48, twentysix: 63 },
  {
    id: 5,
    church: "BCC Drammen Sande",
    thirteen: 64,
    eighteen: 77,
    twentysix: 36,
  },
  {
    id: 6,
    church: "Vácduka",
    thirteen: 46,
    eighteen: 89,
    twentysix: 55,
  },
  {
    id: 7,
    church: "BCC Molde",
    thirteen: 29,
    eighteen: 38,
    twentysix: 91,
  },
  {
    id: 8,
    church: "BCC Sandefjord",
    thirteen: 73,
    eighteen: 42,
    twentysix: 84,
  },
  {
    id: 9,
    church: "Connecticut",
    thirteen: 88,
    eighteen: 57,
    twentysix: 28,
  },
  {
    id: 10,
    church: "Lilienhof",
    thirteen: 22,
    eighteen: 65,
    twentysix: 94,
  },
  {
    id: 11,
    church: "BCC Hønefoss",
    thirteen: 67,
    eighteen: 53,
    twentysix: 81,
  },
  {
    id: 12,
    church: "Urbana",
    thirteen: 45,
    eighteen: 31,
    twentysix: 66,
  },
  {
    id: 13,
    church: "Asociatia Crestina Brunstad Bucuresti",
    thirteen: 79,
    eighteen: 69,
    twentysix: 38,
  },
  {
    id: 14,
    church: "BCC Gelderland",
    thirteen: 55,
    eighteen: 74,
    twentysix: 22,
  },
  {
    id: 15,
    church: "BCC Tønsberg",
    thirteen: 38,
    eighteen: 83,
    twentysix: 40,
  },
  {
    id: 16,
    church: "Toronto",
    thirteen: 94,
    eighteen: 21,
    twentysix: 62,
  },
  {
    id: 17,
    church: "BCC Stord",
    thirteen: 60,
    eighteen: 49,
    twentysix: 75,
  },
  {
    id: 18,
    church: "BCC Østfold",
    thirteen: 47,
    eighteen: 86,
    twentysix: 58,
  },
  {
    id: 19,
    church: "BCC Twente",
    thirteen: 86,
    eighteen: 35,
    twentysix: 47,
  },
  {
    id: 20,
    church: "Seattle",
    thirteen: 33,
    eighteen: 60,
    twentysix: 53,
  },
  {
    id: 21,
    church: "Bafoussam",
    thirteen: 70,
    eighteen: 18,
    twentysix: 96,
  },
  {
    id: 22,
    church: "Douala",
    thirteen: 18,
    eighteen: 72,
    twentysix: 25,
  },
  {
    id: 23,
    church: "Didcot",
    thirteen: 65,
    eighteen: 64,
    twentysix: 88,
  },
  {
    id: 24,
    church: "BCC Oslo og Follo",
    thirteen: 76,
    eighteen: 91,
    twentysix: 50,
  },
  {
    id: 25,
    church: "Nancy",
    thirteen: 41,
    eighteen: 54,
    twentysix: 61,
  },
  {
    id: 26,
    church: "Fulda",
    thirteen: 52,
    eighteen: 39,
    twentysix: 45,
  },
  {
    id: 27,
    church: "BCC Eiker",
    thirteen: 80,
    eighteen: 85,
    twentysix: 27,
  },
  {
    id: 28,
    church: "BCC Horten",
    thirteen: 31,
    eighteen: 66,
    twentysix: 93,
  },
  {
    id: 29,
    church: "Salem",
    thirteen: 63,
    eighteen: 22,
    twentysix: 73,
  },
  {
    id: 30,
    church: "Detroit",
    thirteen: 20,
    eighteen: 79,
    twentysix: 34,
  },
  {
    id: 31,
    church: "South Africa",
    thirteen: 87,
    eighteen: 30,
    twentysix: 55,
  },
  {
    id: 32,
    church: "Mittewald",
    thirteen: 48,
    eighteen: 95,
    twentysix: 64,
  },
  {
    id: 33,
    church: "BCC Måløy",
    thirteen: 66,
    eighteen: 58,
    twentysix: 37,
  },
  {
    id: 34,
    church: "BCC West-Nederland",
    thirteen: 92,
    eighteen: 19,
    twentysix: 85,
  },
  {
    id: 35,
    church: "Linnenbach",
    thirteen: 28,
    eighteen: 82,
    twentysix: 49,
  },
  {
    id: 36,
    church: "BCC Grenland",
    thirteen: 59,
    eighteen: 33,
    twentysix: 87,
  },
  {
    id: 37,
    church: "Melbourne",
    thirteen: 77,
    eighteen: 46,
    twentysix: 60,
  },
  {
    id: 38,
    church: "Ottawa",
    thirteen: 36,
    eighteen: 87,
    twentysix: 52,
  },
  {
    id: 39,
    church: "Waldhausen",
    thirteen: 84,
    eighteen: 37,
    twentysix: 31,
  },
  {
    id: 40,
    church: "Vancouver",
    thirteen: 23,
    eighteen: 68,
    twentysix: 90,
  },
  {
    id: 41,
    church: "Yaoundé",
    thirteen: 89,
    eighteen: 43,
    twentysix: 56,
  },
  {
    id: 42,
    church: "Maubach",
    thirteen: 54,
    eighteen: 81,
    twentysix: 33,
  },
  {
    id: 43,
    church: "New Zealand",
    thirteen: 68,
    eighteen: 29,
    twentysix: 69,
  },
  {
    id: 44,
    church: "BCC Hallingdal",
    thirteen: 95,
    eighteen: 75,
    twentysix: 48,
  },
  {
    id: 45,
    church: "København",
    thirteen: 40,
    eighteen: 88,
    twentysix: 61,
  },
  {
    id: 46,
    church: "Hessenhöfe",
    thirteen: 78,
    eighteen: 41,
    twentysix: 82,
  },
  {
    id: 47,
    church: "Waltrop",
    thirteen: 51,
    eighteen: 56,
    twentysix: 26,
  },
  {
    id: 48,
    church: "Schweiz",
    thirteen: 83,
    eighteen: 25,
    twentysix: 95,
  },
  {
    id: 49,
    church: "BCC Sørlandet",
    thirteen: 61,
    eighteen: 92,
    twentysix: 43,
  },
  {
    id: 50,
    church: "Sydney",
    thirteen: 35,
    eighteen: 47,
    twentysix: 76,
  },
  {
    id: 51,
    church: "BCC Hamar",
    thirteen: 72,
    eighteen: 94,
    twentysix: 39,
  },
  {
    id: 52,
    church: "Novo Sarandi",
    thirteen: 19,
    eighteen: 61,
    twentysix: 86,
  },
  {
    id: 53,
    church: "BCC Stavanger",
    thirteen: 85,
    eighteen: 32,
    twentysix: 57,
  },
  {
    id: 54,
    church: "Ustroń",
    thirteen: 30,
    eighteen: 20,
    twentysix: 67,
  },
  {
    id: 55,
    church: "BCC Bergen",
    thirteen: 74,
    eighteen: 99,
    twentysix: 24,
  },
  {
    id: 56,
    church: "BCC Groningen",
    thirteen: 49,
    eighteen: 44,
    twentysix: 41,
  },
  {
    id: 57,
    church: "Exter",
    thirteen: 96,
    eighteen: 36,
    twentysix: 80,
  },
  {
    id: 58,
    church: "Dürrmenz",
    thirteen: 32,
    eighteen: 50,
    twentysix: 79,
  },
  {
    id: 59,
    church: "Delaware",
    thirteen: 62,
    eighteen: 98,
    twentysix: 54,
  },
  {
    id: 60,
    church: "Holstebro",
    thirteen: 53,
    eighteen: 84,
    twentysix: 42,
  },
  {
    id: 61,
    church: "Hamburg",
    thirteen: 71,
    eighteen: 24,
    twentysix: 97,
  },
  {
    id: 62,
    church: "Huntworth",
    thirteen: 44,
    eighteen: 55,
    twentysix: 51,
  },
  {
    id: 63,
    church: "A-team",
    thirteen: 99,
    eighteen: 63,
    twentysix: 30,
  },
];

const thirteenAvg = computed(
  () => rows.reduce((a, b) => a + b.thirteen, 0) / rows.length,
);

const eighteenAvg = computed(
  () => rows.reduce((a, b) => a + b.eighteen, 0) / rows.length,
);

const twentysixAvg = computed(
  () => rows.reduce((a, b) => a + b.twentysix, 0) / rows.length,
);
</script>

<template>
  <div class="space-y-12">
    <PageHeading>{{ t("dashboards.fra-kare") }}</PageHeading>
    <section
      id="stats"
      class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 sm:gap-6"
    >
      <DashboardStatistic label="Average 13-17" :value="thirteenAvg">
        <template #value="{ value }"> {{ value.toFixed(1) }}% </template>
      </DashboardStatistic>
      <DashboardStatistic label="Average 18-25" :value="eighteenAvg">
        <template #value="{ value }"> {{ value.toFixed(1) }}% </template>
      </DashboardStatistic>
      <DashboardStatistic label="Average 26-36" :value="twentysixAvg">
        <template #value="{ value }"> {{ value.toFixed(1) }}% </template>
      </DashboardStatistic>
    </section>
    <section id="graphs"></section>
    <section id="table">
      <DataTable
        :items="rows"
        :columns="[
          {
            key: 'church',
            text: 'Church',
          },
          {
            key: 'thirteen',
            text: '13-17',
          },
          {
            key: 'eighteen',
            text: '18-25',
          },
          {
            key: 'twentysix',
            text: '26-36',
          },
        ]"
        :get-field="
          (item, key) =>
            typeof item[key] === 'number' ? item[key] + '%' : item[key]
        "
      />
    </section>
  </div>
</template>
