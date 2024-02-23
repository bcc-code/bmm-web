import type { LanguageEnum } from "@bcc-code/bmm-sdk-fetch";

// Copied from https://bmm-api.brunstad.org/, excluded "zxx", because it deserves an extra role.
const availableContentLanguages = [
  "nb",
  "en",
  "de",
  "af",
  "bg",
  "cs",
  "da",
  "el",
  "es",
  "et",
  "fi",
  "fr",
  "he",
  "hr",
  "hu",
  "it",
  "nl",
  "pl",
  "pt",
  "ro",
  "ru",
  "sl",
  "ta",
  "tr",
  "zh",
  "ml",
  "yue",
  "kha",
] as const;

// languages that are in the API data but are kind of unexpected
type unlikelyLanguages =
  | "ar" // Arabic
  | "be" // Belarusian
  | "hi" // Hindi
  | "id" // Indonesian
  | "mn" // Mongolian
  | "no" // Norwegian
  | "sa" // Sanskrit
  | "sr" // Serbian
  | "sv" // Swedish
  | "uk"; // Ukrainian

// This line is to ensure all available content languages are mentioned.
// eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
(
  i: LanguageEnum,
): (typeof availableContentLanguages)[number] | unlikelyLanguages | "zxx" => i;

export default availableContentLanguages;
