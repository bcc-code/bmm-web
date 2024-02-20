export default function getLocalizedLanguageName(key: MaybeRef<string>) {
  const { locale } = useI18n();
  const k = unref(key);
  const intl = new Intl.DisplayNames([locale.value], { type: "language" });

  const translatedValue = intl.of(k) ?? "Unknown";
  return translatedValue === "kha" ? "Khasi" : translatedValue;
}
