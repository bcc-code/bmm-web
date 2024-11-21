import type { LyricsVerse } from "@bcc-code/bmm-sdk-fetch";
import { stripHtml } from "string-strip-html";

export function lyricsVersesFromHtml(_html: string) {
  const verseStrings = _html
    .replaceAll("<h3>", "\n<h3>")
    .split("\n")
    .filter(Boolean);
  const verseObjects = verseStrings
    .filter((verseString) => verseString !== "<p></p>")
    .map((verseString) => {
      const title = verseString.match(/<h3>(.*?)<\/h3>/)?.[1];
      const text = verseString
        .replaceAll(/<h3>(.*?)<\/h3>/g, "")
        .split("</p><p>")
        .join("\n")
        .replaceAll(/<[^>]*>/g, "");

      return { title, text };
    });

  return verseObjects;
}

export function lyricsVersesToHtml(verses: LyricsVerse[]) {
  return verses
    .map((verse) => {
      const title = verse.title ? `<h3>${verse.title}</h3>` : "";
      const text = verse.text
        ? `<p>${verse.text.split("\n").join("</p><p>")}</p>`
        : "";
      return `${title}${text}`;
    })
    .join("");
}

export function lyricsCleanupHtml(html: string) {
  return stripHtml(html, {
    ignoreTags: ["h3", "p"],
  }).result;
}
