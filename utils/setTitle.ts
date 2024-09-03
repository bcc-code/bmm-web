/// These functions can be used when the title of the page and the title of the toolbar are the same.
/// If they are different you need to use toolbarTitleStore and useHead directly.
export default function setTitle(translatedTitle: () => string) {
  toolbarTitleStore().setReactiveToolbarTitle(translatedTitle);
  useHead({
    title: computed(translatedTitle),
  });
}

export function setTitleByRef(title: Ref<string>) {
  toolbarTitleStore().setToolbarTitleByRef(title);
  useHead({
    title,
  });
}
