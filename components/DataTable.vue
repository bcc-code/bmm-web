<!-- 
 Copied from the BCC design library, with some modifications to better fit our needs and our design.
 https://github.com/bcc-code/bcc-design/blob/main/design-library/src/components/BccTable/BccTable.vue
-->

<script setup lang="ts" generic="TItem extends Record<string, any>">
type Column = {
  key: keyof TItem;
  text?: string;
  sortable?: boolean;
  sortMethod?: (a: TItem, b: TItem) => number;
};
type SortDirection = "ascending" | "descending";

const {
  columns,
  items,
  getField = (item, key) => item[key],
} = defineProps<{
  columns: Column[];
  items: TItem[];
  getField?: (item: TItem, key: keyof TItem) => string;
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
  if (sortBy.value === column.key && sortDirection.value === "descending") {
    sortDirection.value = "ascending";
    sortBy.value = undefined;
    return;
  }

  // If the column was already sorted, flip the sort direction
  if (sortBy.value === column.key) {
    sortDirection.value = "descending";
    return;
  }

  // Reset the sort direction when another column is clicked
  sortDirection.value = "ascending";
  sortBy.value = column.key;
}
</script>

<template>
  <div
    class="overflow-hidden rounded-2xl border border-label-separator bg-background-1"
  >
    <table class="w-full table-auto">
      <thead class="type-title-3 bg-background-2 text-left text-label-3">
        <tr>
          <th v-for="column in columns" :key="column.key" scope="col">
            <button
              :disabled="column.sortable === false"
              :class="[
                ' flex items-center gap-1 whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2',
                { 'cursor-pointer': column.sortable !== false },
              ]"
              @click="sort(column)"
            >
              {{ column.text }}

              <span v-if="column.sortable !== false">
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
            v-for="column in columns"
            :key="column.key"
            class="px-3 py-1.5 sm:px-4 sm:py-2"
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
