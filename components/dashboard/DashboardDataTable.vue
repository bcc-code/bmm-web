<!-- 
 Copied from the BCC design library, with some modifications to better fit our needs and our design.
 https://github.com/bcc-code/bcc-design/blob/main/design-library/src/components/BccTable/BccTable.vue
-->

<script lang="ts">
export type SortDirection = "ascending" | "descending";
</script>

<script setup lang="ts" generic="TItem extends Record<string, any>">
type Column = {
  key: keyof TItem;
  text?: string;
  sortable?: boolean;
  sortMethod?: (a: TItem, b: TItem) => number;
  props?: (item?: TItem) => Record<string, any>;
  hide?: boolean;
};

type ColumnGroup = {
  key: string;
  text: string;
  start: number;
  span: number;
};

const {
  columns,
  items,
  getField = (item, key) => item[key],
  columnGroups,
} = defineProps<{
  columns: Column[];
  items: TItem[];
  getField?: (item: TItem, key: keyof TItem) => string;
  highlightRow?: (item: TItem) => boolean;
  columnGroups?: ColumnGroup[];
}>();

const sortBy = defineModel<keyof TItem>("sortBy");
const sortDirection = defineModel<SortDirection>("sortDirection", {
  default: "descending",
});

const sortedItems = computed(() => {
  if (sortBy.value === undefined) {
    return items;
  }

  const column = columns.find((c) => c.key === sortBy.value);

  if (!column) {
    throw new Error("Sorting by unknown column");
  }

  const sortableItems = [...items];

  if (column.sortMethod) {
    return sortableItems.sort(column.sortMethod);
  }

  return sortableItems.sort((a, b) => {
    const firstItem = getField(a, column.key);
    const secondItem = getField(b, column.key);
    if (firstItem < secondItem)
      return sortDirection.value === "descending" ? 1 : -1;
    if (firstItem > secondItem)
      return sortDirection.value === "descending" ? -1 : 1;
    return 0;
  });
});

function sort(column: Column) {
  if (column.sortable === false) {
    return;
  }

  // Stop sorting this column if we have cycled through both sorting directions
  if (sortBy.value === column.key && sortDirection.value === "ascending") {
    sortDirection.value = "ascending";
    sortBy.value = undefined;
    return;
  }

  // If the column was already sorted, flip the sort direction
  if (sortBy.value === column.key) {
    sortDirection.value = "ascending";
    return;
  }

  // Reset the sort direction when another column is clicked
  sortDirection.value = "descending";
  sortBy.value = column.key;
}

const filteredColumns = computed(() => columns.filter((c) => !c.hide));

const emptyColumnsBeforeFirstColumnGroup = computed(() => {
  if (!columnGroups) return 0;
  const sorted = columnGroups.toSorted((a, b) => a.start - b.start);
  if (!sorted[0]) return 0;
  return sorted[0].start;
});
</script>

<template>
  <div
    class="overflow-x-auto rounded-2xl border border-label-separator bg-background-1"
  >
    <table class="w-full table-auto">
      <thead class="type-title-3 text-left text-label-3">
        <tr v-if="columnGroups?.length">
          <th v-for="i in emptyColumnsBeforeFirstColumnGroup" :key="i" />
          <th
            v-for="columnGroup in columnGroups"
            :key="columnGroup.key"
            scope="colgroup"
            class="px-3 py-1.5 sm:px-4 sm:py-2"
            :colspan="columnGroup.span"
          >
            {{ columnGroup.text }}
          </th>
        </tr>
        <tr class="bg-background-2">
          <th
            v-for="column in filteredColumns"
            :key="column.key"
            scope="col"
            class="p-0"
          >
            <button
              :disabled="column.sortable === false"
              :class="[
                'group flex w-full items-center gap-1 whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2',
                { 'cursor-pointer': column.sortable !== false },
              ]"
              v-bind="column.props?.()"
              @click="sort(column)"
            >
              {{ column.text }}

              <span
                v-if="column.sortable !== false"
                :class="[
                  'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
                  { 'opacity-100': sortBy === column.key },
                ]"
              >
                <NuxtIcon
                  v-if="sortBy !== column.key"
                  name="icon.chevron.up-down"
                />
                <NuxtIcon
                  v-if="sortBy == column.key && sortDirection == 'ascending'"
                  name="icon.chevron.up"
                />
                <NuxtIcon
                  v-if="sortBy == column.key && sortDirection == 'descending'"
                  name="icon.chevron.down"
                />
              </span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody
        class="type-subtitle-2 divide-y divide-label-separator text-label-1"
      >
        <tr v-for="(item, key) in sortedItems" :key="key">
          <td
            v-for="column in filteredColumns"
            :key="column.key"
            class="px-3 py-1.5 sm:px-4 sm:py-2"
            v-bind="column.props?.(item)"
            :class="{
              'bg-tint text-black-1': highlightRow?.(item) ?? false,
            }"
          >
            <slot :name="column.key" :item="item">
              <span>
                {{ getField(item, column.key) }}
              </span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
