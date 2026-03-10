export default function weekDay(date: Date | undefined) {
  if (date === undefined) return "";

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    timeZone: "UTC",
  };
  return new Intl.DateTimeFormat(
    useNuxtApp().$i18n.locale.value,
    options,
  ).format(dateToUtc(date));
}
