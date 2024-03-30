import type { DocumentListIAllDocumentModels } from "@bcc-code/bmm-sdk-fetch";

export default function setTitleOfDocumentList(
  data: Ref<DocumentListIAllDocumentModels | null>,
) {
  watch(
    data,
    () => {
      toolbarTitleStore().setToolbarTitle(data.value?.title ?? " ");
      useHead({
        title: computed(() => data.value?.title ?? ""),
      });
    },
    { immediate: true },
  );
}
