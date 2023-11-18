export default function getLocalizedLanguageName(key: MaybeRef<string>) {
  const { locale } = useI18n();
  const k = unref(key);
  const intl = new Intl.DisplayNames([locale.value], { type: "language" });

  return intl.of(k);
}
