export const errorBeingShown = ref<string | null>();

// code is only used for tracking purposes to identify the error independent of the users language.
// So you can just make one up but please make sure to not change it afterwards.
export default function showError(code: string, message: string) {
  const { $appInsights } = useNuxtApp();
  let anotherErrorIsShown = false;
  if (errorBeingShown.value != null) {
    anotherErrorIsShown = true;
    console.error(message, code);
  } else errorBeingShown.value = message;
  $appInsights.event("show error to user", {
    code,
    message,
    anotherErrorIsShown,
  });
}

export function errorHasBeenAcknowledged() {
  errorBeingShown.value = null;
}
