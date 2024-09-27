import type { LanguageEnum } from "@bcc-code/bmm-sdk-fetch";

export default function transcriptionStorageKey(
  trackId: number,
  language: LanguageEnum,
) {
  return `transcription:${trackId}-${language}`;
}
