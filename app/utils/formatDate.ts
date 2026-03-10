export default function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  };
  return new Intl.DateTimeFormat(
    useNuxtApp().$i18n.locale.value,
    options,
  ).format(dateToUtc(date));
}
