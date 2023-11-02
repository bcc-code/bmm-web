export default function getLocalizedList(
  values: MaybeRef<string[]>,
  options?: Intl.ListFormatOptions
) {
  const { locale } = useI18n();
  const rawValues = unref(values);

  const intl = new Intl.ListFormat([locale.value], options);
  return intl.format(rawValues);
}
